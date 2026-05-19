const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Get Comments for a Post ──────────────────────────
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

// ─── Create Comment ───────────────────────────────────
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    // Update comment count on post — returned to client
    const commentCount = await prisma.comment.count({ where: { postId } });

    res.status(201).json({
      message: "Comment added",
      comment,
      commentCount,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Comment ───────────────────────────────────
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the author can delete their comment
    if (comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    // Return fresh count
    const commentCount = await prisma.comment.count({
      where: { postId: comment.postId },
    });

    res.json({
      message: "Comment deleted",
      commentCount,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Edit Comment ─────────────────────────────────────
const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment" });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.json({ message: "Comment updated", comment: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, deleteComment, editComment };
