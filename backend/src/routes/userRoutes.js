const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');

router.use(protect);

// Fetch all registered users (Admin Only)
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return sendSuccess(res, 'Users retrieved successfully', users, 200);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
});

module.exports = router;