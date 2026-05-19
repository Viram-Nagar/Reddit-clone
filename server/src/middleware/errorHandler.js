const AppError = require("../utils/AppError");

// ─── Handle Prisma errors ─────────────────────────────
const handlePrismaError = (err) => {
  // Unique constraint violation (e.g. duplicate email)
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return new AppError(`A record with this ${field} already exists`, 409);
  }

  // Record not found
  if (err.code === "P2025") {
    return new AppError("Record not found", 404);
  }

  // Foreign key constraint failed
  if (err.code === "P2003") {
    return new AppError("Related record not found", 400);
  }

  // Required field missing
  if (err.code === "P2011") {
    return new AppError("Required field is missing", 400);
  }

  return new AppError("Database error occurred", 500);
};

// ─── Handle JWT errors ────────────────────────────────
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);

// ─── Send error in development (verbose) ─────────────
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// ─── Send error in production (safe) ─────────────────
const sendErrorProd = (err, res) => {
  // Operational errors: send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming errors: don't leak details
    console.error("💥 UNEXPECTED ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ─── Global error handler middleware ──────────────────
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message };

  // Handle specific error types
  if (err.name === "PrismaClientKnownRequestError") {
    error = handlePrismaError(err);
  }
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }
  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }
  if (err.name === "ValidationError") {
    error = new AppError(err.message, 400);
  }
  if (err.name === "SyntaxError" && err.status === 400) {
    error = new AppError("Invalid JSON in request body", 400);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;

// const errorHandler = (err, req, res, next) => {
//   console.error("❌ Error:", err.stack);

//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     message: err.message || "Internal Server Error",
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// };

// module.exports = errorHandler;
