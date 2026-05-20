const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const prisma = new PrismaClient();

// ─── Register ─────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    // req.body is already Zod-validated at this point

    // Check if email already exists
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        message: "Validation failed",
        errors: [{ field: "email", message: "Email already in use" }],
      });
    }

    // Check if username already exists
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return res.status(409).json({
        message: "Validation failed",
        errors: [{ field: "username", message: "Username already taken" }],
      });
    }

    // Hash password (10 salt rounds is the sweet spot)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate JWT and set cookie
    generateToken(res, user.id);

    res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user (include password for comparison)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Validation failed",
        errors: [
          { field: "email", message: "No account found with this email" },
        ],
      });
    }

    // Compare password with hashed version
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Validation failed",
        errors: [{ field: "password", message: "Incorrect password" }],
      });
    }

    // Generate JWT and set cookie
    generateToken(res, user.id);

    // Never send password back to client
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0), // Expire cookie immediately
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

// ─── Get Current User ─────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
