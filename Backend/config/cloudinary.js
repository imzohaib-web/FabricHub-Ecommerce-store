const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

// Guarantee that environment variables are parsed and loaded before configuration runs
dotenv.config({ path: path.join(__dirname, '../.env') });

// Clean/trim string values
const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : null;
const apiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : null;
const apiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : null;

const isConfigured = cloudName && apiKey && apiSecret;

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  console.log('Cloudinary successfully configured using .env credentials.');
} else {
  console.warn('⚠️ WARNING: Cloudinary credentials not configured in .env. Falling back to development mock uploader.');
  
  // Inject mock upload stream for local development testing
  cloudinary.uploader.upload_stream = (options, callback) => {
    return {
      end: (buffer) => {
        const randomId = Math.random().toString(36).substring(2, 9);
        const folder = options.folder || 'FabricHub/products';
        const mockUrl = `https://res.cloudinary.com/mock-cloud/image/upload/v1720000000/${folder}/mock_${randomId}.jpg`;
        
        setTimeout(() => {
          callback(null, { secure_url: mockUrl });
        }, 100);
      }
    };
  };

  // Inject mock uploader destroy for local development testing
  cloudinary.uploader.destroy = async (publicId) => {
    console.log(`[MOCK CLOUDINARY] Destroy request received for publicId: "${publicId}"`);
    return { result: 'ok' };
  };
}

module.exports = cloudinary;
