const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart.model');

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  return require('../utils/response').success(res, cart || { items: [] });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity, size });
  }
  await cart.save();
  return require('../utils/response').success(res, cart);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity = Number(quantity);
    await cart.save();
  }
  return require('../utils/response').success(res, cart);
});

exports.removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  return require('../utils/response').success(res, cart);
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  return require('../utils/response').success(res, { message: 'Cart cleared' });
});
