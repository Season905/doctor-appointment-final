const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admin = async (req, res, next) => {
  // Check if user exists in request
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'NO_AUTH'
    });
  }

  // Verify admin privileges
  if (req.user.role !== 'admin') {
    console.warn(`Unauthorized admin access attempt by user: ${req.user._id}`);
    return res.status(403).json({
      success: false,
      error: 'Administrator privileges required',
      code: 'ADMIN_REQUIRED',
      docs: 'https://api.yourdomain.com/docs/authorization'
    });
  }

  // Add security headers for admin routes
  res.header('X-Admin-Access', 'true');
  res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.header('X-Content-Type-Options', 'nosniff');

  // Rate limiting for admin endpoints
  const rateLimit = req.rateLimit;
  if (rateLimit && rateLimit.remaining < 5) {
    res.header('X-RateLimit-Remaining', rateLimit.remaining);
    res.header('X-RateLimit-Reset', rateLimit.resetTime);
  }

  next();
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findOne({ _id: decoded.id, role: 'admin' });

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = {
  admin,
  adminAuth
};