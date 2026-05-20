const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // HTTPS only in production
    sameSite: "none", // 'none' needed for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

module.exports = generateToken;

// const jwt = require("jsonwebtoken");

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

//   // Store JWT in httpOnly cookie (more secure than localStorage)
//   res.cookie("token", token, {
//     httpOnly: true, // JS can't access this cookie
//     secure: process.env.NODE_ENV === "production", // HTTPS only in prod
//     sameSite: "strict", // Prevents CSRF
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
//   });

//   return token;
// };

// module.exports = generateToken;
