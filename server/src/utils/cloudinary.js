const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Delete image by public_id ─────────────────────────
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw error;
  }
};

// ─── Extract public_id from Cloudinary URL ─────────────
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{public_id}.{ext}
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Join everything after version number
    const afterUpload = parts.slice(uploadIndex + 2); // skip 'upload' and version
    const publicIdWithExt = afterUpload.join("/");
    const publicId = publicIdWithExt.split(".")[0]; // remove extension
    return publicId;
  } catch {
    return null;
  }
};

module.exports = { cloudinary, deleteImage, getPublicIdFromUrl };
