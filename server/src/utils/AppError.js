// Custom error class that carries HTTP status codes
// Usage: throw new AppError('Not found', 404)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks as expected (not a bug)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
