const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.model');

exports.createProduct = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'owner' && req.user.role !== 'admin') return res.status(403).json({ message: 'Owner access required' });

  const {
    name,
    description,
    category,
    price,
    discountPrice = 0,
    stock = 0,
    isFeatured = false,
  } = req.body;

  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  const files = req.files || [];
  const urls = files.map((file) => file.path || file.filename || '').filter(Boolean);
  const mainImage = urls[0] || '';
  const images = urls.slice(1);
  const imagesMeta = files.map((file) => ({
    url: file.path || file.filename || '',
    publicId: file.filename || file.public_id || '',
  }));
  const sellerName = req.user.name || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Unknown Seller';

  if (!sellerName || sellerName === 'Unknown Seller') {
    console.error('Missing seller name. req.user:', { id: req.user.id, name: req.user.name, firstName: req.user.firstName, lastName: req.user.lastName });
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    discountPrice,
    stock,
    mainImage,
    image: mainImage,
    images,
    imagesMeta,
    owner: req.user._id || req.user.id,
    createdBy: req.user._id || req.user.id,
    sellerName,
    status: 'pending',
    isFeatured,
  });

  const { success } = require('../utils/response');
  return success(res, product);
});

exports.listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});
