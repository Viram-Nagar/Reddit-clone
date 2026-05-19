const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Helper: calculate vote score for a post ──────────
const getVoteScore = async (postId) => {
  const votes = await prisma.vote.findMany({
    where: { postId },
    select: { type: true },
  });

  const upvotes = votes.filter((v) => v.type === "UP").length;
  const downvotes = votes.filter((v) => v.type === "DOWN").length;

  return { upvotes, downvotes, voteScore: upvotes - downvotes };
};

// ─── Vote on a Post ───────────────────────────────────
// Logic:
//   No existing vote → create vote
//   Same vote exists → delete vote (toggle off)
//   Different vote exists → update vote (switch UP↔DOWN)
const voteOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { type } = req.body; // 'UP' or 'DOWN'
    const userId = req.user.id;

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check for existing vote from this user on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId }, // composite unique key
      },
    });

    if (!existingVote) {
      // ── Case 1: No vote yet → Create ──────────────
      await prisma.vote.create({
        data: { type, userId, postId },
      });
    } else if (existingVote.type === type) {
      // ── Case 2: Same vote → Toggle off (delete) ───
      await prisma.vote.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
    } else {
      // ── Case 3: Different vote → Switch ───────────
      await prisma.vote.update({
        where: {
          userId_postId: { userId, postId },
        },
        data: { type },
      });
    }

    // Calculate fresh score
    const { upvotes, downvotes, voteScore } = await getVoteScore(postId);

    // Get user's current vote state
    const currentVote = await prisma.vote.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { type: true },
    });

    res.json({
      message: "Vote recorded",
      voteScore,
      upvotes,
      downvotes,
      userVote: currentVote?.type || null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Vote Stats for a Post ────────────────────────
const getVoteStats = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id || null;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { upvotes, downvotes, voteScore } = await getVoteScore(postId);

    const currentVote = userId
      ? await prisma.vote.findUnique({
          where: { userId_postId: { userId, postId } },
          select: { type: true },
        })
      : null;

    res.json({
      voteScore,
      upvotes,
      downvotes,
      userVote: currentVote?.type || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { voteOnPost, getVoteStats };
