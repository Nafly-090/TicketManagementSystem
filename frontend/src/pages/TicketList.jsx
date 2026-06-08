import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTickets } from '../store/slices/ticketSlice';
import { Eye, Search, SlidersHorizontal } from 'lucide-react';

const TicketList = () => {
  const dispatch = useDispatch();
  const { tickets, pagination, isLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTickets({ search, category, priority, status, sort, page }));
  }, [dispatch, search, category, priority, status, sort, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const getPriorityBadgeColor = (prio) => {
    const colors = {
      Low: 'bg-gray-100 text-gray-800',
      Medium: 'bg-blue-100 text-blue-800',
      High: 'bg-amber-100 text-amber-800',
      Urgent: 'bg-rose-100 text-rose-800',
    };
    return colors[prio] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (stat) => {
    const colors = {
      Open: 'bg-sky-100 text-sky-800 border-sky-200',
      'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
      Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[stat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-600">Track, filter, and inspect incoming requests.</p>
        </div>
        {user?.role === 'user' && (
          <Link to="/tickets/create" className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">
            Create New Ticket
          </Link>
        )}
      </div>

      {/* Advanced Filter Layout */}
      {/* Advanced Filter Layout with Sorting */}
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, title, details..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="w-full md:w-44 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Account Issue">Account Issue</option>
          </select>
        </div>

        <div className="w-full md:w-44 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="w-full md:w-44 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Added: Sorting dropdown which resolves both 'SlidersHorizontal' and 'setSort' warnings */}
        <div className="w-full md:w-44 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-gray-400" /> Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority-desc">Highest Priority</option>
            <option value="priority-asc">Lowest Priority</option>
          </select>
        </div>
      </div>

      {/* Ticket Table Display */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600 font-medium">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">No tickets found matching current criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">{ticket.ticketNumber}</td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <p className="font-semibold text-gray-900">{ticket.title}</p>
                      <p className="text-xs text-gray-400 truncate">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{ticket.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getPriorityBadgeColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{ticket.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-center">
                      <Link to={`/tickets/${ticket._id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-xs font-semibold">
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className="px-3.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages || isLoading}
              className="px-3.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketList;