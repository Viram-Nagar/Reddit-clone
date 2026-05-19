const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../utils/cloudinary");
const AppError = require("../utils/AppError");

// ─── Allowed file types ────────────────────────────────
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "gif", "webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ─── Cloudinary storage for posts ─────────────────────
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "reddit_clone/posts",
    allowed_formats: ALLOWED_FORMATS,
    transformation: [
      { width: 1200, height: 1200, crop: "limit" }, // Max dimensions
      { quality: "auto:good" }, // Auto optimize quality
      { fetch_format: "auto" }, // Serve webp if supported
    ],
    public_id: `post_${req.user?.id}_${Date.now()}`,
  }),
});

// ─── Cloudinary storage for avatars ───────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "reddit_clone/avatars",
    allowed_formats: ALLOWED_FORMATS,
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
    public_id: `avatar_${req.user?.id}`,
    overwrite: true, // Replace existing avatar
  }),
});

// ─── File filter ───────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError("Only image files are allowed", 400), false);
  }
  cb(null, true);
};

// ─── Multer instances ──────────────────────────────────
const uploadPostImage = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single("image"); // field name must be 'image'

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for avatars
}).single("avatar");

// ─── Wrap multer in promise for async/await ────────────
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("File too large. Maximum size is 5MB", 400));
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    }
    if (err) return next(err);
    next();
  });
};

module.exports = {
  handleUploadPost: handleUpload(uploadPostImage),
  handleUploadAvatar: handleUpload(uploadAvatar),
};
