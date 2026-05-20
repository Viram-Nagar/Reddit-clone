const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

// Routes
const authRoutes = require("./routes/auth.routes");
const communityRoutes = require("./routes/community.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const voteRoutes = require("./routes/vote.routes");
const userRoutes = require("./routes/user.routes");
const feedRoutes = require("./routes/feed.routes");
const uploadRoutes = require("./routes/upload.routes");

// Middleware
const errorHandler = require("./middleware/errorHandler");
const {
  sanitizeInput,
  preventInjection,
} = require("./middleware/sanitize.middleware");
const {
  apiLimiter,
  authLimiter,
  createPostLimiter,
  voteLimiter,
} = require("./middleware/rateLimiter.middleware");

const app = express();

// ─── Security Headers ─────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disabled for dev flexibility
  }),
);

// ─── CORS ─────────────────────────────────────────────
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error(`CORS blocked origin: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  }),
);

app.set("trust proxy", 1);
// ─── Body Parsing ─────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── Sanitization ─────────────────────────────────────
app.use(sanitizeInput);
app.use(preventInjection);

// ─── Global rate limiter ──────────────────────────────
app.use("/api", apiLimiter);

// ─── Health check ─────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Reddit Clone API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ──────────────────────────────────────────
// Auth with stricter rate limiting
app.use("/api/auth", authLimiter, authRoutes);

// Posts with creation rate limiting
app.use("/api/posts", postRoutes);

// Votes with vote-specific limiting
app.use("/api/votes", voteLimiter, voteRoutes);

// Standard routes
app.use("/api/communities", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/upload", uploadRoutes);

// ─── 404 for undefined routes ─────────────────────────
app.use((req, res, next) => {
  // BUG "*", (req,res ,next)
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global error handler (must be last) ─────────────
app.use(errorHandler);

module.exports = app;

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// const helmet = require("helmet");

// dotenv.config();

// const authRoutes = require("./routes/auth.routes");
// const communityRoutes = require("./routes/community.routes");
// const postRoutes = require("./routes/post.routes");
// const commentRoutes = require("./routes/comment.routes");
// const voteRoutes = require("./routes/vote.routes");
// const userRoutes = require("./routes/user.routes");
// const errorHandler = require("./middleware/errorHandler");
// const feedRoutes = require("./routes/feed.routes");

// const app = express();

// // ─── Middleware ───────────────────────────────
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true, // Required for cookies to work cross-origin
//   }),
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ─── Routes ──────────────────────────────────
// app.use("/api/auth", authRoutes);
// app.use("/api/communities", communityRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/votes", voteRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/feed", feedRoutes);

// // ─── Health Check ─────────────────────────────
// app.get("/api/health", (req, res) => {
//   res.json({ status: "OK", message: "Reddit Clone API is running 🚀" });
// });

// // ─── Error Handler (must be last) ────────────
// app.use(errorHandler);

// module.exports = app;
