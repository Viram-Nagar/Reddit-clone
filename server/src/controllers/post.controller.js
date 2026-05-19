const { PrismaClient } = require("@prisma/client");
const { deleteImage, getPublicIdFromUrl } = require("../utils/cloudinary");

const prisma = new PrismaClient();

// ─── Helper: attach vote score + user vote ─────────────
const attachVoteData = (posts, userId = null) => {
  return posts.map((post) => {
    const upvotes = post.votes.filter((v) => v.type === "UP").length;
    const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
    const userVote = userId
      ? post.votes.find((v) => v.userId === userId)?.type || null
      : null;

    const { votes, ...postWithoutVotes } = post;
    return {
      ...postWithoutVotes,
      voteScore: upvotes - downvotes,
      userVote,
    };
  });
};

// ─── Get All Posts (Home Feed) ─────────────────────────
const getAllPosts = async (req, res, next) => {
  try {
    const { sort = "new", page = 1, limit = 20 } = req.query;
    const userId = req.user?.id || null;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await prisma.post.findMany({
      skip,
      take: parseInt(limit),
      orderBy: sort === "new" ? { createdAt: "desc" } : { createdAt: "desc" }, // votes sort handled after fetch
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: { select: { type: true, userId: true } },
        _count: { select: { comments: true } },
      },
    });

    let enriched = attachVoteData(posts, userId);

    // Sort by vote score after enriching
    if (sort === "top") {
      enriched = enriched.sort((a, b) => b.voteScore - a.voteScore);
    }

    const total = await prisma.post.count();

    res.json({ posts: enriched, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

// ─── Get Posts by Community ────────────────────────────
const getPostsByCommunity = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { sort = "new" } = req.query;
    const userId = req.user?.id || null;

    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const posts = await prisma.post.findMany({
      where: { communityId: community.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: { select: { type: true, userId: true } },
        _count: { select: { comments: true } },
      },
    });

    let enriched = attachVoteData(posts, userId);

    if (sort === "top") {
      enriched = enriched.sort((a, b) => b.voteScore - a.voteScore);
    }

    res.json({ posts: enriched });
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Post ───────────────────────────────────
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: { select: { type: true, userId: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, username: true, avatar: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [enriched] = attachVoteData([post], userId);

    res.json({ post: enriched });
  } catch (error) {
    next(error);
  }
};

// ─── Create Post ───────────────────────────────────────
const createPost = async (req, res, next) => {
  try {
    const { title, content, imageUrl, type, communityId } = req.body;

    // Verify community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content: content || null,
        imageUrl: imageUrl || null,
        type,
        communityId,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        votes: true,
        _count: { select: { comments: true } },
      },
    });

    const [enriched] = attachVoteData([post], req.user.id);

    res.status(201).json({
      message: "Post created successfully",
      post: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Post ───────────────────────────────────────
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete image from Cloudinary if it exists
    if (post.imagePublicId) {
      await deleteImage(post.imagePublicId).catch(console.error);
    } else if (post.imageUrl) {
      // Try to extract and delete from URL as fallback
      const publicId = getPublicIdFromUrl(post.imageUrl);
      if (publicId) await deleteImage(publicId).catch(console.error);
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// const deletePost = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const post = await prisma.post.findUnique({ where: { id } });

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Only author can delete
//     if (post.authorId !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to delete this post" });
//     }

//     await prisma.post.delete({ where: { id } });

//     res.json({ message: "Post deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getAllPosts,
  getPostsByCommunity,
  getPostById,
  createPost,
  deletePost,
};
