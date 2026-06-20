const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.model');

exports.createProduct = asyncHandler(async (req, res) => {
  console.log('createProduct called. req.user:', req.user ? { _id: req.user._id, role: req.user.role, name: req.user.name } : 'null');
  
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'owner' && req.user.role !== 'admin') return res.status(403).json({ message: 'Owner access required' });

  const {
    name,
    description,
    category,
    price,
    discountPrice = '0',
    stock = '0',
    isFeatured = 'false',
  } = req.body;

  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  // Convert string values from FormData to proper types
  const priceNum = parseFloat(price);
  const discountPriceNum = parseFloat(discountPrice) || 0;
  const stockNum = parseInt(stock) || 0;
  const isFeaturedBool = isFeatured === 'true' || isFeatured === true;

  // Validate numeric conversions
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }
  if (discountPriceNum < 0) {
    return res.status(400).json({ message: 'Discount price cannot be negative' });
  }
  if (stockNum < 0) {
    return res.status(400).json({ message: 'Stock cannot be negative' });
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

  console.log('Creating product:', { name, category, price: priceNum, owner: req.user._id, sellerName });

  try {
    const product = await Product.create({
      name,
      description,
      category,
      price: priceNum,
      discountPrice: discountPriceNum,
      stock: stockNum,
      mainImage,
      image: mainImage,
      images,
      imagesMeta,
      owner: req.user._id,
      createdBy: req.user._id,
      sellerName,
      status: 'pending',
      isFeatured: isFeaturedBool,
      likes: [],
    });

    console.log('Product created successfully:', product._id);
    const { success } = require('../utils/response');
    return success(res, product);
  } catch (err) {
    console.error('Error creating product:', err.message, err);
    throw err;
  }
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
