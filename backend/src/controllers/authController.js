const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Simple basic validation
    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password', null, 400);
    }

    const result = await authService.registerUser({ name, email, password, role });
    return sendSuccess(res, 'User registered successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email and password', null, 400);
    }

    const result = await authService.loginUser(email, password);
    return sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

module.exports = {
  register,
  login,
};