const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes'); 
const userRoutes = require('./routes/userRoutes'); // <-- Added
const { sendError } = require('./utils/response');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());


// Base Route for a friendly api gateway status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "QTechy Ticket Management System API Gateway is active and running."
  });
});

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes); 


// Catch-all route for unmatched paths (404 handler)
app.use((req, res, next) => {
  sendError(res, `Route not found - ${req.originalUrl}`, null, 404);
});

module.exports = app;