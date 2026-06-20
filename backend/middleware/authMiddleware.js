const jwt = require('jsonwebtoken');

exports.verifyJWT = (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

exports.verifyOwner = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'owner' && req.user.role !== 'admin') return res.status(403).json({ message: 'Owner access required' });
  next();
};
