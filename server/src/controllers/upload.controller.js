const { deleteImage, getPublicIdFromUrl } = require("../utils/cloudinary");
const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppError");

const prisma = new PrismaClient();

// ─── Upload post image ─────────────────────────────────
const uploadPostImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("No image file provided", 400));
    }

    res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public_id
      width: req.file.width,
      height: req.file.height,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Upload avatar ────────────────────────────────────
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("No image file provided", 400));
    }

    // Delete old avatar from Cloudinary if it exists
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatar: true },
    });

    if (user?.avatar) {
      const oldPublicId = getPublicIdFromUrl(user.avatar);
      if (oldPublicId) {
        await deleteImage(oldPublicId).catch(console.error);
      }
    }

    // Update user avatar in DB
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: req.file.path },
      select: {
        id: true,
        username: true,
        avatar: true,
        email: true,
      },
    });

    res.json({
      message: "Avatar updated successfully",
      imageUrl: req.file.path,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete image ──────────────────────────────────────
const deleteUploadedImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return next(new AppError("Public ID is required", 400));
    }

    // Security: only allow deleting images owned by this user
    if (!publicId.includes(req.user.id)) {
      return next(new AppError("Not authorized to delete this image", 403));
    }

    await deleteImage(publicId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadPostImage, uploadAvatar, deleteUploadedImage };
