const router = require("express").Router();
const {
  uploadPostImage,
  uploadAvatar,
  deleteUploadedImage,
} = require("../controllers/upload.controller");
const { protect } = require("../middleware/auth.middleware");
const {
  handleUploadPost,
  handleUploadAvatar,
} = require("../middleware/upload.middleware");

// Upload post image
router.post("/post-image", protect, handleUploadPost, uploadPostImage);

// Upload user avatar
router.post("/avatar", protect, handleUploadAvatar, uploadAvatar);

// Delete uploaded image
router.delete("/image", protect, deleteUploadedImage);

module.exports = router;
