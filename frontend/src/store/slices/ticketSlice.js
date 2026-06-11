import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchStats = createAsyncThunk('tickets/fetchStats', async (_, thunkAPI) => {
  try {
    const response = await API.get('/tickets/stats');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
  }
});

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (queryParams = {}, thunkAPI) => {
  try {
    const response = await API.get('/tickets', { params: queryParams });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
  }
});

export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId, thunkAPI) => {
  try {
    const response = await API.get(`/tickets/${ticketId}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket details');
  }
});

export const createTicket = createAsyncThunk('tickets/createTicket', async (ticketData, thunkAPI) => {
  try {
    const response = await API.post('/tickets', ticketData);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
  }
});

export const updateTicketStatus = createAsyncThunk('tickets/updateTicketStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await API.patch(`/tickets/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status');
  }
});

export const assignTicket = createAsyncThunk('tickets/assignTicket', async ({ id, agentId }, thunkAPI) => {
  try {
    const response = await API.patch(`/tickets/${id}/assign`, { agentId });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
  }
});

export const addComment = createAsyncThunk('tickets/addComment', async ({ id, text }, thunkAPI) => {
  try {
    const response = await API.post(`/tickets/${id}/comments`, { text });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to post comment');
  }
});

export const updateTicket = createAsyncThunk('tickets/updateTicket', async ({ id, ticketData }, thunkAPI) => {
  try {
    const response = await API.put(`/tickets/${id}`, ticketData);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
  }
});

export const deleteTicket = createAsyncThunk('tickets/deleteTicket', async (id, thunkAPI) => {
  try {
    const response = await API.delete(`/tickets/${id}`);
    return response.data.data; // Returns { id: "ticket_id_deleted" }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete ticket');
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
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketDetails = action.payload;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketDetails = action.payload;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter((t) => t._id !== action.payload.id);
        state.ticketDetails = null;
      })

      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )
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