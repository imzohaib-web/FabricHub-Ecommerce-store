const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

// Set up Multer memory storage (keeps files in buffers to stream directly)
const storage = multer.memoryStorage();

// Restrict uploads to images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image file uploads are supported.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit per image
  }
});

/**
 * Upload a single file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - Image file buffer.
 * @param {string} folder - Destination subfolder on Cloudinary.
 * @returns {Promise<string>} Secure URL of the uploaded image.
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `FabricHub/${folder}`,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(new AppError('Image upload to Cloudinary failed: ' + error.message, 500));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Extract public_id from Cloudinary secure URL.
 * Example URL: https://res.cloudinary.com/cloud-name/image/upload/v12345/FabricHub/products/file.jpg
 * Returns: FabricHub/products/file
 */
const getPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes('/upload/')) return null;

    const parts = url.split('/upload/');
    if (parts.length < 2) return null;

    let pathAndName = parts[1];
    // Remove version segment (e.g. v123456789/) if present
    if (pathAndName.startsWith('v')) {
      const slashIndex = pathAndName.indexOf('/');
      if (slashIndex > -1) {
        pathAndName = pathAndName.substring(slashIndex + 1);
      }
    }

    // Strip file extension
    const dotIndex = pathAndName.lastIndexOf('.');
    if (dotIndex > -1) {
      return pathAndName.substring(0, dotIndex);
    }
    return pathAndName;
  } catch (err) {
    console.error('Error parsing Cloudinary public ID from URL:', err);
    return null;
  }
};

/**
 * Delete an image from Cloudinary using its secure URL.
 * @param {string} url - Secure URL of the image.
 */
const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;

  try {
    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion completed for ID "${publicId}":`, res.result);
    return res;
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset "${publicId}":`, err.message);
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl
};
