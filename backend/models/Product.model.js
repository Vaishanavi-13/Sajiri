const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Women', 'Men', 'Kids'] },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
  images: [{ url: String, publicId: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
