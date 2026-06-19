const asyncHandler = require('express-async-handler');
const Order = require('../models/Order.model');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Cart = require('../models/Cart.model');

exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  const order = await Order.create({ user: req.user._id, orderItems, shippingAddress, paymentMethod, totalPrice });
  const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const razor = await instance.orders.create({ amount: Math.round(totalPrice * 100), currency: 'INR', receipt: String(order._id) });
  return require('../utils/response').success(res, { orderId: order._id, razorpay_order_id: razor.id });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated = hmac.digest('hex');
  if (generated !== razorpay_signature) return require('../utils/response').error(res, 'Invalid signature', 400);
  const order = await Order.findById(orderId);
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'paid' };
  await order.save();
  // clear cart
  await Cart.findOneAndDelete({ user: req.user._id });
  return require('../utils/response').success(res, { message: 'Payment verified', order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  return require('../utils/response').success(res, orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
  if (!order) return require('../utils/response').error(res, 'Not found', 404);
  return require('../utils/response').success(res, order);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'firstName lastName email');
  return require('../utils/response').success(res, orders);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return require('../utils/response').error(res, 'Not found', 404);
  order.status = status;
  await order.save();
  return require('../utils/response').success(res, order);
});

exports.acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return require('../utils/response').error(res, 'Not found', 404);
  order.status = 'accepted';
  await order.save();
  return require('../utils/response').success(res, order);
});

exports.rejectOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return require('../utils/response').error(res, 'Not found', 404);
  order.status = 'rejected';
  await order.save();
  return require('../utils/response').success(res, order);
});

exports.deliverOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return require('../utils/response').error(res, 'Not found', 404);
  order.status = 'delivered';
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  return require('../utils/response').success(res, order);
});
