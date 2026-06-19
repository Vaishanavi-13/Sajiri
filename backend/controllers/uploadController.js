const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = asyncHandler(async (req, res) => {
  // expects base64 image in req.body.data or multer file handling
  const { data } = req.body;
  if (!data) return require('../utils/response').error(res, 'No image data', 400);
  const result = await cloudinary.uploader.upload(data, { folder: 'sajiri/products' });
  return require('../utils/response').success(res, { url: result.secure_url, public_id: result.public_id });
});
