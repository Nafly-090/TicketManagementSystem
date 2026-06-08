const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, errorDetails = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};

module.exports = { sendSuccess, sendError };