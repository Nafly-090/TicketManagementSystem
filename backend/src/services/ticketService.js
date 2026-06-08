const Ticket = require('../models/Ticket');
const User = require('../models/User');

const createNewTicket = async (ticketData, userId) => {
  const { title, description, category, priority } = ticketData;

  const ticket = await Ticket.create({
    title,
    description,
    category,
    priority,
    createdBy: userId,
    statusHistory: [
      {
        status: 'Open',
        changedBy: userId,
      },
    ],
  });

  return ticket;
};

const listAllTickets = async (query, user) => {
  const { search, category, priority, status, sort, page = 1, limit = 10 } = query;
  const filter = {};

  if (user.role === 'user') {
    filter.createdBy = user._id;
  } else if (user.role === 'agent') {
    filter.assignedTo = user._id;
  }

  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { ticketNumber: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'priority-asc') sortOption = { priority: 1 };
    if (sort === 'priority-desc') sortOption = { priority: -1 };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const tickets = await Ticket.find(filter)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Ticket.countDocuments(filter);

  return {
    tickets,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTicketById = async (ticketId, user) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('comments.user', 'name email role')
    .populate('statusHistory.changedBy', 'name email role');

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'user' && ticket.createdBy._id.toString() !== user._id.toString()) {
    const error = new Error('Not authorized to access this ticket');
    error.statusCode = 403;
    throw error;
  }

  return ticket;
};

// 1. UPDATE TICKET DETAILS (Title, description, category, priority)
const updateTicketDetails = async (ticketId, updateData, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  // Only the creator or an Admin can edit metadata
  if (user.role !== 'admin' && ticket.createdBy.toString() !== user._id.toString()) {
    const error = new Error('Not authorized to modify this ticket details');
    error.statusCode = 403;
    throw error;
  }

  const { title, description, category, priority } = updateData;
  if (title) ticket.title = title;
  if (description) ticket.description = description;
  if (category) ticket.category = category;
  if (priority) ticket.priority = priority;

  await ticket.save();
  return getTicketById(ticketId, user);
};

// 2. UPDATE TICKET STATUS (Saves status change to Status History)
const updateTicketStatus = async (ticketId, newStatus, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  // Security validation: Users cannot update statuses at all. Agents can only update their ASSIGNED tickets.
  if (user.role === 'user') {
    const error = new Error('Clients are not authorized to change ticket statuses');
    error.statusCode = 403;
    throw error;
  }
  if (user.role === 'agent' && ticket.assignedTo?.toString() !== user._id.toString()) {
    const error = new Error('Agents can only update their assigned support tickets');
    error.statusCode = 403;
    throw error;
  }

  ticket.status = newStatus;
  ticket.statusHistory.push({
    status: newStatus,
    changedBy: user._id,
  });

  await ticket.save();
  return getTicketById(ticketId, user);
};

// 3. ASSIGN TICKET TO AN AGENT (Admin Only)
const assignTicketToAgent = async (ticketId, agentId, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify the target user actually has an 'agent' or 'admin' role
  const targetAgent = await User.findById(agentId);
  if (!targetAgent || (targetAgent.role !== 'agent' && targetAgent.role !== 'admin')) {
    const error = new Error('Assigned user must be an agent or admin');
    error.statusCode = 400;
    throw error;
  }

  ticket.assignedTo = agentId;
  await ticket.save();
  return getTicketById(ticketId, user);
};

// 4. ADD COMMENT TO TICKET (Admin, Agent assigned, or original User Creator)
const addCommentToTicket = async (ticketId, text, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  // Check commenting rights
  if (user.role === 'user' && ticket.createdBy.toString() !== user._id.toString()) {
    const error = new Error('Not authorized to comment on this ticket');
    error.statusCode = 403;
    throw error;
  }
  if (user.role === 'agent' && ticket.assignedTo?.toString() !== user._id.toString()) {
    const error = new Error('Agents can only comment on assigned tickets');
    error.statusCode = 403;
    throw error;
  }

  ticket.comments.push({
    user: user._id,
    text,
  });

  await ticket.save();
  return getTicketById(ticketId, user);
};

// 5. DELETE TICKET (Admin Only)
const deleteTicket = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }
  await Ticket.findByIdAndDelete(ticketId);
  return { id: ticketId };
};

// 6. DYNAMIC DASHBOARD STATS (Aggregated per-role)
const getDashboardStats = async (user) => {
  const filter = {};

  if (user.role === 'user') {
    filter.createdBy = user._id;
  } else if (user.role === 'agent') {
    filter.assignedTo = user._id;
  }

  const stats = await Ticket.aggregate([
    { $match: filter },
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        byCategory: [
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ],
        totalTickets: [
          { $count: 'count' }
        ]
      }
    }
  ]);

  // Restructure counts cleanly for the frontend UI metrics cards
  const formatGroup = (arr) => arr.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
  const data = stats[0];

  return {
    total: data.totalTickets[0]?.count || 0,
    statusCounts: {
      Open: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
      ...formatGroup(data.byStatus)
    },
    priorityCounts: {
      Low: 0,
      Medium: 0,
      High: 0,
      Urgent: 0,
      ...formatGroup(data.byPriority)
    },
    categoryCounts: formatGroup(data.byCategory),
  };
};

module.exports = {
  createNewTicket,
  listAllTickets,
  getTicketById,
  updateTicketDetails,
  updateTicketStatus,
  assignTicketToAgent,
  addCommentToTicket,
  deleteTicket,
  getDashboardStats,
};