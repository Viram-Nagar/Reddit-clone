const router = require("express").Router();
const {
  getComments,
  createComment,
  deleteComment,
  editComment,
} = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createCommentSchema } = require("../schemas/comment.schema");

// Get comments for a post — public
router.get("/post/:postId", getComments);

// Add comment to a post — protected
router.post(
  "/post/:postId",
  protect,
  validate(createCommentSchema),
  createComment,
);

// Edit & delete comment — protected
router.patch(
  "/:commentId",
  protect,
  validate(createCommentSchema),
  editComment,
);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
