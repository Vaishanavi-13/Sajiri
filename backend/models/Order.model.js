const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    zipCode: String,
    phoneNumber: String,
  },
  paymentMethod: { type: String },
  paymentResult: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: String,
  },
  totalPrice: { type: Number },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled','accepted','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
