import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

// 1. Fetch Dashboard Stats
export const fetchStats = createAsyncThunk('tickets/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await API.get('/tickets/stats');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
  }
});

// 2. Fetch Ticket List with search, filtering, and pagination
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (queryParams = {}, thunkAPI) => {
  try {
    const response = await API.get('/tickets', { params: queryParams });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
  }
});

// 3. Fetch Single Ticket Details
export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId, thunkAPI) => {
  try {
    const response = await API.get(`/tickets/${ticketId}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket details');
  }
});

// 4. Create New Ticket
export const createTicket = createAsyncThunk('tickets/createTicket', async (ticketData, thunkAPI) => {
  try {
    const response = await API.post('/tickets', ticketData);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
  }
});

// 5. Update Ticket Status
export const updateTicketStatus = createAsyncThunk('tickets/updateTicketStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await API.patch(`/tickets/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status');
  }
});

// 6. Assign Ticket
export const assignTicket = createAsyncThunk('tickets/assignTicket', async ({ id, agentId }, thunkAPI) => {
  try {
    const response = await API.patch(`/tickets/${id}/assign`, { agentId });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
  }
});

// 7. Add Comment
export const addComment = createAsyncThunk('tickets/addComment', async ({ id, text }, thunkAPI) => {
  try {
    const response = await API.post(`/tickets/${id}/comments`, { text });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to post comment');
  }
});

const initialState = {
  tickets: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  ticketDetails: null,
  stats: null,
  isLoading: false,
  isError: false,
  message: '',
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.ticketDetails = null;
    },
    resetTicketState: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. ALL addCase() CALLS MUST BE DEFINED FIRST
      // Stats Fulfilled
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      // List Fulfilled
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      // Details Fulfilled
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketDetails = action.payload;
      })
      // Create Fulfilled
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
      })

      // 2. ALL addMatcher() CALLS DEFINED SECOND
      // General Pending Handler
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      // General Rejected Handler
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )
      // Status, Assign, Comment Fulfilled (Updates ticketDetails inside memory directly)
      .addMatcher(
        (action) =>
          action.type === updateTicketStatus.fulfilled.type ||
          action.type === assignTicket.fulfilled.type ||
          action.type === addComment.fulfilled.type,
        (state, action) => {
          state.isLoading = false;
          state.ticketDetails = action.payload;
        }
      );
  },
});

export const { clearDetails, resetTicketState } = ticketSlice.actions;
export default ticketSlice.reducer;