const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  publicId: { type: String, default: '' },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  token: { type: String },
  isVerified: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  address: { type: String },
  city: { type: String },
  zipCode: { type: String },
  phoneNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
