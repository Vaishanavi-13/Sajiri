const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendOtpEmail } = require('../utils/email');

const createAccessToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const createRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashed, isVerified: true });
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET, { expiresIn: '10m' });
    await sendVerificationEmail(user.email, token);
  } catch (emailErr) {
    console.warn('Verification email skipped:', emailErr.message);
  }
  const { success } = require('../utils/response');
  return success(res, { message: 'Registered successfully. Please check your email if configured.' });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.isVerified = true;
    await user.save();
    const { success } = require('../utils/response');
    return success(res, { message: 'Email verified' });
  } catch (err) {
    res.status(400).json({ message: 'Token invalid or expired' });
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.isLoggedIn = true;
  await user.save();
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  const { success } = require('../utils/response');
  return success(res, { accessToken, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
});

exports.logout = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    user.isLoggedIn = false;
    await user.save();
  }
  res.clearCookie('refreshToken');
  const { success } = require('../utils/response');
  return success(res, { message: 'Logged out' });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, an OTP was sent' });
  const otp = ('' + Math.floor(100000 + Math.random() * 900000));
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();
  await sendOtpEmail(user.email, otp);
  const { success } = require('../utils/response');
  return success(res, { message: 'OTP sent' });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid' });
  if (!user.otp || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  const { success } = require('../utils/response');
  return success(res, { message: 'OTP verified' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid' });
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  const { success } = require('../utils/response');
  return success(res, { message: 'Password updated' });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    const accessToken = createAccessToken(user);
    const { success } = require('../utils/response');
    return success(res, { accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Refresh token invalid' });
  }
});
