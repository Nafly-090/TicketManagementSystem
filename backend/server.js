// Polyfill for older Node.js versions lacking globalThis.crypto
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// // Connect to MongoDB Database
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
//   });
// });

// Connect to MongoDB Database
connectDB()
  .then(() => {
    // CRUCIAL: Only start listening on a local port if we are NOT in production serverless environment
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
      });
    } else {
      console.log('Database connected successfully (Production Serverless Mode)');
    }
  })
  .catch((err) => {
    console.error('Database connection failed on startup:', err.message);
  });

module.exports = app;
