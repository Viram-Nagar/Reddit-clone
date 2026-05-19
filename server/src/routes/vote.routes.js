const router = require("express").Router();
const { voteOnPost, getVoteStats } = require("../controllers/vote.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { voteSchema } = require("../schemas/vote.schema");

// Vote on a post (requires auth)
router.post("/:postId", protect, validate(voteSchema), voteOnPost);

// Get vote stats for a post (optional auth for userVote)
router.get("/:postId", optionalAuth, getVoteStats);

module.exports = router;
