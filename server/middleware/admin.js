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
const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin privileges required'
    });
  }
  next();
};


module.exports = {
  admin,
  adminAuth
};