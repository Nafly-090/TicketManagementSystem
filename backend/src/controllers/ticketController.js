const ticketService = require('../services/ticketService');
const { sendSuccess, sendError } = require('../utils/response');

const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title || !description || !category || !priority) {
      return sendError(res, 'Missing required fields for ticket creation', null, 400);
    }
    const ticket = await ticketService.createNewTicket(req.body, req.user._id);
    return sendSuccess(res, 'Ticket created successfully', ticket, 201);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const getTickets = async (req, res) => {
  try {
    const result = await ticketService.listAllTickets(req.query, req.user);
    return sendSuccess(res, 'Tickets retrieved successfully', result, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const getSingleTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id, req.user);
    return sendSuccess(res, 'Ticket details retrieved successfully', ticket, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await ticketService.updateTicketDetails(req.params.id, req.body, req.user);
    return sendSuccess(res, 'Ticket updated successfully', updatedTicket, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 'Status value is required', null, 400);
    }
    const updatedTicket = await ticketService.updateTicketStatus(req.params.id, status, req.user);
    return sendSuccess(res, 'Status updated successfully', updatedTicket, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!agentId) {
      return sendError(res, 'Agent ID is required for assignment', null, 400);
    }
    const updatedTicket = await ticketService.assignTicketToAgent(req.params.id, agentId, req.user);
    return sendSuccess(res, 'Ticket assigned successfully', updatedTicket, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return sendError(res, 'Comment text cannot be empty', null, 400);
    }
    const updatedTicket = await ticketService.addCommentToTicket(req.params.id, text, req.user);
    return sendSuccess(res, 'Comment added successfully', updatedTicket, 201);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const removeTicket = async (req, res) => {
  try {
    const result = await ticketService.deleteTicket(req.params.id);
    return sendSuccess(res, 'Ticket deleted successfully', result, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await ticketService.getDashboardStats(req.user);
    return sendSuccess(res, 'Dashboard metrics fetched successfully', stats, 200);
  } catch (error) {
    return sendError(res, error.message, null, error.statusCode || 500);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getSingleTicket,
  updateTicket,
  updateStatus,
  assignTicket,
  addComment,
  removeTicket,
  getStats,
};