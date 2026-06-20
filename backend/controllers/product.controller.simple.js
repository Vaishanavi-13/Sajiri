const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.model');

// Get all products with pagination and filtering
exports.getProducts = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sortBy } = req.query;
    const query = { status: 'approved' };
    
    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    
    let cursor = Product.find(query);
    
    if (sortBy === 'price_asc') cursor = cursor.sort({ price: 1 });
    else if (sortBy === 'price_desc') cursor = cursor.sort({ price: -1 });
    else if (sortBy === 'newest') cursor = cursor.sort({ createdAt: -1 });
    else cursor = cursor.sort({ isFeatured: -1, createdAt: -1 });
    
    const skip = (Number(page) - 1) * Number(limit);
    const items = await cursor.skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        items,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Get featured products
exports.getFeatured = asyncHandler(async (req, res) => {
  try {
    const items = await Product.find({ isFeatured: true, status: 'approved' })
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    console.error('Error fetching featured products:', err);
    res.status(500).json({ message: 'Error fetching featured products', error: err.message });
  }
});

// Get single product by ID
exports.getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Like/Unlike product
exports.likeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // For now, just return the like count without tracking individual users
    // In a real app, you'd need user authentication
    const likeCount = product.likes.length || 0;
    
    res.json({
      success: true,
      data: {
        likes: likeCount,
        liked: false
      }
    });
  } catch (err) {
    console.error('Error liking product:', err);
    res.status(500).json({ message: 'Error processing like', error: err.message });
  }
});
