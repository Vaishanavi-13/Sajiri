const Razorpay = require('razorpay');
const asyncHandler = require('express-async-handler');

exports.createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const options = { amount: Math.round(amount * 100), currency };
  const order = await instance.orders.create(options);
  return require('../utils/response').success(res, order);
});
