const router = require("express").Router();
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
