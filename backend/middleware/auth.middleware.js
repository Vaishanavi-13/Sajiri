const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

exports.verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token found' });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error('verifyJWT error:', err.message);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Strict owner-only check. Only role === 'owner' allowed.
exports.verifyOwner = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner access required' });
  next();
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

exports.protect = exports.verifyJWT;
