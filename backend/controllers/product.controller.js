const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.model');

exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock } = req.body;
  const files = req.files || [];
  const images = files.map((file) => ({ url: file.path, publicId: file.filename }));
  const image = images.length ? images[0].url : '';
  const sellerName = `${req.user.firstName} ${req.user.lastName}`;
  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock,
    image,
    images,
    owner: req.user._id,
    sellerName,
    status: 'pending',
  });
  const { success } = require('../utils/response');
  return success(res, product);
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('owner', 'firstName lastName email');
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  return require('../utils/response').success(res, product);
});

exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, status = 'approved', search, sortBy } = req.query;
  const query = { status };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  let cursor = Product.find(query);
  if (sortBy === 'price_asc') cursor = cursor.sort({ price: 1 });
  else if (sortBy === 'price_desc') cursor = cursor.sort({ price: -1 });
  else if (sortBy === 'newest') cursor = cursor.sort({ createdAt: -1 });
  const skip = (Number(page) - 1) * Number(limit);
  const items = await cursor.skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(query);
  return require('../utils/response').success(res, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

exports.getPendingProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ status: 'pending' }).populate('owner', 'firstName lastName email');
  return require('../utils/response').success(res, items);
});

exports.approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  product.status = 'approved';
  await product.save();
  return require('../utils/response').success(res, product);
});

exports.rejectProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  product.status = 'rejected';
  await product.save();
  return require('../utils/response').success(res, product);
});

exports.getFeatured = asyncHandler(async (req, res) => {
  const items = await Product.find({ isFeatured: true }).limit(8);
  return require('../utils/response').success(res, items);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return require('../utils/response').success(res, product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return require('../utils/response').success(res, { message: 'Deleted' });
});
