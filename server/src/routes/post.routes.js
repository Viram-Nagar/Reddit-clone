const router = require("express").Router();
const {
  getAllPosts,
  getPostsByCommunity,
  getPostById,
  createPost,
  deletePost,
} = require("../controllers/post.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createPostSchema } = require("../schemas/post.schema");
const { createPostLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/", optionalAuth, getAllPosts);
router.get("/:id", optionalAuth, getPostById);
router.get("/community/:slug", optionalAuth, getPostsByCommunity);

// Apply post creation rate limiter
router.post(
  "/",
  protect,
  createPostLimiter,
  validate(createPostSchema),
  createPost,
);
router.delete("/:id", protect, deletePost);

module.exports = router;

// const router = require("express").Router();
// const {
//   getAllPosts,
//   getPostsByCommunity,
//   getPostById,
//   createPost,
//   deletePost,
// } = require("../controllers/post.controller");
// const { protect, optionalAuth } = require("../middleware/auth.middleware");
// const validate = require("../middleware/validate.middleware");
// const { createPostSchema } = require("../schemas/post.schema");

// // Public (but attach user if logged in for vote state)
// router.get("/", optionalAuth, getAllPosts);
// router.get("/:id", optionalAuth, getPostById);
// router.get("/community/:slug", optionalAuth, getPostsByCommunity);

// // Protected
// router.post("/", protect, validate(createPostSchema), createPost);
// router.delete("/:id", protect, deletePost);

// module.exports = router;
