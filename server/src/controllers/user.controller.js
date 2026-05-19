const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ─── Get Public Profile ───────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total karma (upvotes received on all posts)
    const votes = await prisma.vote.findMany({
      where: {
        post: { authorId: user.id },
        type: "UP",
      },
    });

    res.json({
      user: {
        ...user,
        karma: votes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get User Posts ───────────────────────────────────
const getUserPosts = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
      include: {
        community: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, username: true, avatar: true },
        },
        votes: {
          select: { type: true, userId: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    // Attach vote scores
    const enriched = posts.map((post) => {
      const upvotes = post.votes.filter((v) => v.type === "UP").length;
      const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
      const { votes, ...rest } = post;
      return {
        ...rest,
        voteScore: upvotes - downvotes,
        userVote: null,
      };
    });

    const total = await prisma.post.count({ where: { authorId: user.id } });

    res.json({ posts: enriched, total });
  } catch (error) {
    next(error);
  }
};

// ─── Get User Comments ────────────────────────────────
const getUserComments = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { authorId: user.id },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            community: {
              select: { name: true, slug: true },
            },
          },
        },
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    const total = await prisma.comment.count({ where: { authorId: user.id } });

    res.json({ comments, total });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile (own account only) ───────────────
const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    next(error);
  }
};

// ─── Change Password ──────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [{ field: "currentPassword", message: "Incorrect password" }],
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getUserPosts,
  getUserComments,
  updateProfile,
  changePassword,
};
