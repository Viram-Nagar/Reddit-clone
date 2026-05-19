const router = require("express").Router();
const {
  getHomeFeed,
  getFollowingFeed,
  getTrendingCommunities,
  search,
} = require("../controllers/feed.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");

// Public feed
router.get("/home", optionalAuth, getHomeFeed);

// Following feed — requires auth
router.get("/following", protect, getFollowingFeed);

// Trending communities — public
router.get("/trending", getTrendingCommunities);

// Search — public
router.get("/search", optionalAuth, search);

module.exports = router;
