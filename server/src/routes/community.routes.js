const router = require("express").Router();
const {
  getAllCommunities,
  getCommunityBySlug,
  createCommunity,
  joinCommunity,
  checkMembership,
} = require("../controllers/community.controller");
const { getPostsByCommunity } = require("../controllers/post.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createCommunitySchema } = require("../schemas/community.schema");

// Public
router.get("/", getAllCommunities);
router.get("/:slug", getCommunityBySlug);
router.get("/:slug/posts", optionalAuth, getPostsByCommunity);

// Protected
router.post("/", protect, validate(createCommunitySchema), createCommunity);
router.post("/:slug/join", protect, joinCommunity);
router.get("/:slug/membership", protect, checkMembership);

module.exports = router;
