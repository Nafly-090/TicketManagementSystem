const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Bug', 'Feature Request', 'Technical Issue', 'Payment Issue', 'Account Issue', 'Other'],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [commentSchema],
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// Automatic sequential Ticket Number Generation (e.g. TKT-0001, TKT-0002)
ticketSchema.pre('save', async function () {
  if (!this.isNew) return;

  try {
    // Find the ticket with the most recent creation timestamp
    const lastTicket = await mongoose.model('Ticket').findOne({}, {}, { sort: { createdAt: -1 } });

    let newSeq = 1;
    if (lastTicket && lastTicket.ticketNumber) {
      const lastNum = parseInt(lastTicket.ticketNumber.replace('TKT-', ''), 10);
      if (!isNaN(lastNum)) {
        newSeq = lastNum + 1;
      }
    }

    // Format with leading zeros (e.g., TKT-0001)
    this.ticketNumber = `TKT-${String(newSeq).padStart(4, '0')}`;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);