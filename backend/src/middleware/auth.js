const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

// Middleware to verify if user is logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decrypt token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to req object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return sendError(res, 'The user belonging to this token no longer exists.', null, 401);
      }
      
      next();
    } catch (error) {
      return sendError(res, 'Not authorized, token failed', error.message, 401);
    }
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', null, 401);
  }
};

// Middleware to check roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user?.role || 'Guest'}' is not authorized to access this route`,
        null,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };