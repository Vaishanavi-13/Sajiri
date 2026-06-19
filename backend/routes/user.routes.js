const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const upload = require('../middleware/upload.middleware');
const cloudinary = require('cloudinary').v2;

// GET profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// update profile
router.put('/profile', protect, async (req, res) => {
  const { firstName, lastName, address, city, zipCode, phoneNumber } = req.body;
  const user = await User.findById(req.user._id);
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (address) user.address = address;
  if (city) user.city = city;
  if (zipCode) user.zipCode = zipCode;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  await user.save();
  res.json(user);
});

// upload profile pic
router.put('/profile-pic', protect, upload.single('image'), async (req, res) => {
  // multer-storage-cloudinary stores file info in req.file
  const user = await User.findById(req.user._id);
  if (user.publicId) {
    try{ await cloudinary.uploader.destroy(user.publicId); } catch(e){}
  }
  user.profilePic = req.file.path || req.file?.filename || '';
  user.publicId = req.file?.filename || req.file?.public_id || '';
  await user.save();
  res.json(user);
});

// admin get users
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// toggle role
router.put('/:id/role', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.role = user.role === 'admin' ? 'user' : 'admin';
  await user.save();
  res.json(user);
});

// delete user
router.delete('/:id', protect, admin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
