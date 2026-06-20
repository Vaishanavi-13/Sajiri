const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.model');

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    // auth checks: ensure JWT middleware attached user
    if (!req.user) return require('../utils/response').error(res, 'Not authenticated', 401);
    // Only owners allowed
    if (req.user.role !== 'owner') return require('../utils/response').error(res, 'Owner access required', 403);

    const { name, description, category, price, discountPrice = '0', stock = '0', isFeatured = 'false' } = req.body;
    if (!name || !description || !category || !price) return require('../utils/response').error(res, 'Missing required product fields', 400);

    // Convert string values from FormData to proper types
    const priceNum = parseFloat(price);
    const discountPriceNum = parseFloat(discountPrice) || 0;
    const stockNum = parseInt(stock) || 0;
    const isFeaturedBool = isFeatured === 'true' || isFeatured === true;

    // Validate numeric conversions
    if (isNaN(priceNum) || priceNum <= 0) return require('../utils/response').error(res, 'Price must be a valid positive number', 400);
    if (discountPriceNum < 0) return require('../utils/response').error(res, 'Discount price cannot be negative', 400);
    if (stockNum < 0) return require('../utils/response').error(res, 'Stock cannot be negative', 400);

    const files = req.files || [];

    // Normalize file URLs: prefer file.path, fall back to filename served under /uploads
    const normalizeFileUrl = (file) => {
      if (!file) return '';
      if (file.path) return file.path;
      if (file.location) return file.location; // multer-storage-cloudinary may set 'location'
      if (file.url) return file.url;
      if (file.filename) return `/uploads/${file.filename}`;
      return '';
    };

    const urls = files.map((f) => normalizeFileUrl(f)).filter(Boolean);
    const mainImage = urls[0] || '';
    const images = urls.slice(1);

    const sellerName = req.user?.name || `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || 'Unknown Seller';

    // Log payload for debugging before creating the product
    console.log('createProduct payload:', {
      name,
      description,
      category,
      price: priceNum,
      discountPrice: discountPriceNum,
      stock: stockNum,
      mainImage,
      images,
      imagesMeta: files.map((file) => ({ url: normalizeFileUrl(file), publicId: file.filename || file.public_id || '' })),
      isFeatured: isFeaturedBool,
      owner: req.user?._id,
      createdBy: req.user?._id,
      sellerName,
    });

    const product = await Product.create({
      name,
      description,
      category,
      price: priceNum,
      discountPrice: discountPriceNum,
      stock: stockNum,
      mainImage,
      images,
      image: mainImage,
      imagesMeta: files.map((file) => ({ url: normalizeFileUrl(file), publicId: file.filename || file.public_id || '' })),
      likes: [],
      isFeatured: isFeaturedBool,
      owner: req.user._id,
      createdBy: req.user._id,
      sellerName,
      status: 'approved',
    });

    const { success } = require('../utils/response');
    return success(res, product);
  } catch (err) {
    // Log full error for server-side debugging
    console.error('createProduct error:', err && err.stack ? err.stack : err);

    // If this is a Mongoose validation error, return a 400 with details
    if (err && err.name === 'ValidationError') {
      const details = Object.keys(err.errors || {}).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
      return require('../utils/response').error(res, `Validation failed: ${err.message}`, 400);
    }

    return require('../utils/response').error(res, 'Server error while creating product', 500);
  }
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('owner', 'firstName lastName email');
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  return require('../utils/response').success(res, product);
});

exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, status = 'approved', search, sortBy, owner } = req.query;
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (owner) query.owner = owner;
  if (search) query.$text = { $search: search };
  let cursor = Product.find(query).populate('owner', 'firstName lastName email');
  if (sortBy === 'price_asc') cursor = cursor.sort({ price: 1 });
  else if (sortBy === 'price_desc') cursor = cursor.sort({ price: -1 });
  else if (sortBy === 'newest') cursor = cursor.sort({ createdAt: -1 });
  const skip = (Number(page) - 1) * Number(limit);
  const items = await cursor.skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(query);
  return require('../utils/response').success(res, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

exports.likeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  const userId = req.user._id.toString();
  const existing = product.likes.find((id) => id.toString() === userId);
  if (existing) {
    product.likes = product.likes.filter((id) => id.toString() !== userId);
  } else {
    product.likes.push(req.user._id);
  }
  await product.save();
  return require('../utils/response').success(res, { likes: product.likes.length, liked: !existing });
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
  const items = await Product.find({ isFeatured: true, status: 'approved' }).limit(8);
  return require('../utils/response').success(res, items);
});

exports.getPendingProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ status: 'pending' }).populate('owner', 'firstName lastName email');
  return require('../utils/response').success(res, items);
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ owner: req.user._id }).populate('owner', 'firstName lastName email');
  return require('../utils/response').success(res, items);
});

const isOwnerOrAdmin = (user, product) => user.role === 'admin' || product.owner.toString() === user._id.toString();

exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, discountPrice, stock, status, isFeatured } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  if (!isOwnerOrAdmin(req.user, product)) return require('../utils/response').error(res, 'Not authorized', 403);
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = price;
  if (discountPrice !== undefined) product.discountPrice = discountPrice;
  if (stock !== undefined) product.stock = stock;
  if (status !== undefined && req.user.role === 'admin') product.status = status;
  if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (req.files && req.files.length) {
    const images = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    product.images = images;
    product.image = images[0]?.url || product.image;
  }
  await product.save();
  return require('../utils/response').success(res, product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return require('../utils/response').error(res, 'Not found', 404);
  if (!isOwnerOrAdmin(req.user, product)) return require('../utils/response').error(res, 'Not authorized', 403);
  await product.remove();
  return require('../utils/response').success(res, { message: 'Deleted' });
});
