// ─── Strip dangerous characters from strings ──────────
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
    .trim();
};

// ─── Recursively sanitize an object ───────────────────
const sanitizeObject = (obj) => {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = sanitizeObject(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// ─── Sanitize middleware ───────────────────────────────
const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

// ─── Prevent NoSQL injection in query strings ─────────
const preventInjection = (req, res, next) => {
  // Remove $ and . from query params (MongoDB injection patterns)
  // Useful even with Prisma as a defense-in-depth measure
  const clean = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        clean(obj[key]);
      }
    });
    return obj;
  };

  clean(req.query);
  clean(req.body);
  next();
};

module.exports = { sanitizeInput, preventInjection };
