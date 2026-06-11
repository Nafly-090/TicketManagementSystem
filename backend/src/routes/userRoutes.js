const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');

// All user management routes are strictly Admin Only
router.use(protect, authorize('admin'));

// 1. READ: Fetch all registered users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return sendSuccess(res, 'Users retrieved successfully', users, 200);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
});

// 2. CREATE: Admin can add any user/agent directly
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Missing required name, email, or password fields', null, 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'A user with this email already exists', null, 400);
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Strip password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return sendSuccess(res, 'User created successfully by Administrator', userResponse, 201);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
});

// 3. UPDATE: Admin can modify name, email, and role
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    // Check for email collision if changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return sendError(res, 'This email is already associated with another account', null, 400);
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, 'User updated successfully', userResponse, 200);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
});

// 4. DELETE: Admin can delete users (preventing self-deletion)
router.delete('/:id', async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return sendError(res, 'Self-deletion is prohibited', null, 400);
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    await User.findByIdAndDelete(targetUserId);
    return sendSuccess(res, 'User deleted successfully', { id: targetUserId }, 200);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
});

module.exports = router;