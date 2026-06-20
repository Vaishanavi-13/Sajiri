const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Women', 'Men', 'Kids'] },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  mainImage: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  imagesMeta: [{ url: String, publicId: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
  subCategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  fabric: { type: String, default: '' },
  color: { type: String, default: '' },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
