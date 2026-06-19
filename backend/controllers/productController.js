const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

exports.createProduct = asyncHandler(async (req, res) => {
  const payload = req.body;
  const product = await Product.create(payload);
  res.status(201).json(product);
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
