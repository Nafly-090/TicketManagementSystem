const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

// All ticket operations require valid credentials
router.use(protect);

// Dashboard Statistics Route
router.get('/stats', ticketController.getStats);

// Main Core Routes
router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getSingleTicket);
router.put('/:id', ticketController.updateTicket);

// Comments
router.post('/:id/comments', ticketController.addComment);

// Status Management (Agents & Admins only)
router.patch('/:id/status', authorize('agent', 'admin'), ticketController.updateStatus);

// Assignment & Deletion (Admins only)
router.patch('/:id/assign', authorize('admin'), ticketController.assignTicket);
router.delete('/:id', authorize('admin'), ticketController.removeTicket);

module.exports = router;