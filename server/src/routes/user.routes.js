const router = require("express").Router();
const {
  getProfile,
  getUserPosts,
  getUserComments,
  updateProfile,
  changePassword,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// Public
router.get("/:username", getProfile);
router.get("/:username/posts", getUserPosts);
router.get("/:username/comments", getUserComments);

// Protected — own account only
router.patch("/me/profile", protect, updateProfile);
router.patch("/me/password", protect, changePassword);

module.exports = router;
