import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTicketDetails, 
  updateTicketStatus, 
  assignTicket, 
  addComment, 
  clearDetails,
  deleteTicket
} from '../store/slices/ticketSlice';
import { fetchAllUsers } from '../store/slices/userSlice';
import { ArrowLeft, MessageSquare, Clock, ShieldAlert, User, CheckCircle, Edit2, Trash2 } from 'lucide-react'; 
const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticketDetails, isLoading, isError, message } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  const [commentText, setCommentText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchTicketDetails(id));
    
    if (user?.role === 'admin') {
      dispatch(fetchAllUsers());
    }

    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, id, user?.role]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setUpdating(true);
    await dispatch(addComment({ id, text: commentText }));
    setCommentText('');
    setUpdating(false);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    setUpdating(true);
    await dispatch(updateTicketStatus({ id, status: newStatus }));
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure you want to permanently delete this ticket?')) {
      setUpdating(true);
      const resultAction = await dispatch(deleteTicket(id));
      if (deleteTicket.fulfilled.match(resultAction)) {
        navigate('/tickets');
      } else {
        setUpdating(false);
        alert(resultAction.payload || 'Failed to delete ticket.');
      }
    }
  };

  const handleAssignmentChange = async (e) => {
    const agentId = e.target.value;
    if (!agentId) return;

    setUpdating(true);
    await dispatch(assignTicket({ id, agentId }));
    setUpdating(false);
  };

  if (isLoading && !ticketDetails) {
    return <div className="text-gray-600 font-medium">Loading ticket details...</div>;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {message}</div>
        <button onClick={() => navigate('/tickets')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          <ArrowLeft size={16} /> Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticketDetails) return null;

  const agents = users.filter((u) => u.role === 'agent' || u.role === 'admin');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/tickets" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <ArrowLeft size={16} /> Back to Tickets
          </Link>
          
          {(user?.role === 'admin' || ticketDetails.createdBy._id === user?._id) && (
            <Link 
              to={`/tickets/${id}/edit`} 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Edit2 size={12} /> Edit Ticket
            </Link>
          )}
        </div>
        <span className="text-sm text-gray-500 font-semibold">
          Ticket Created: {new Date(ticketDetails.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 border border-gray-100 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 tracking-wider bg-indigo-50 px-3 py-1 rounded-md">
                {ticketDetails.ticketNumber}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                Category: <strong className="text-gray-700">{ticketDetails.category}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">{ticketDetails.title}</h1>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm whitespace-pre-wrap">
              {ticketDetails.description}
            </p>
          </div>

          <div className="bg-white p-8 border border-gray-100 rounded-xl shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
              <MessageSquare size={18} className="text-gray-500" /> Comments Thread ({ticketDetails.comments.length})
            </h2>

            {ticketDetails.comments.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No comments added yet. Use the area below to start the conversation.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {ticketDetails.comments.map((comment) => (
                  <div key={comment._id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{comment.user.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          {comment.user.role}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="pt-4 border-t border-gray-100 space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                placeholder="Type your reply here..."
                required
                disabled={updating}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                disabled={updating || !commentText.trim()}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
              >
                {updating ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-xs space-y-6">
            <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CheckCircle size={16} className="text-indigo-600" /> Actions Panel
            </h3>

            {(user?.role === 'admin' || (user?.role === 'agent' && ticketDetails.assignedTo?._id === user?._id)) ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Status</label>
                <select
                  value={ticketDetails.status}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <p className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg capitalize">
                  {ticketDetails.status}
                </p>
              </div>
            )}

            {user?.role === 'admin' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Ticket</label>
                <select
                  value={ticketDetails.assignedTo?._id || ''}
                  onChange={handleAssignmentChange}
                  disabled={updating}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                >
                  <option value="">-- Choose Agent --</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Agent</label>
                <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">
                  {ticketDetails.assignedTo?.name || 'Unassigned'}
                </p>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-rose-500" /> Priority:
                </span>
                <span className="text-rose-700 uppercase font-bold">{ticketDetails.priority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-500" /> Created By:
                </span>
                <span className="text-gray-900">{ticketDetails.createdBy.name}</span>
              </div>
            </div>
          </div>

          {user?.role === 'admin' && (
           <button
             type="button"
             onClick={handleDelete}
             disabled={updating}
             className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors border border-red-200 disabled:opacity-50"
           >
             <Trash2 size={14} /> Delete Support Ticket
           </button>
         )}

          <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-xs space-y-4">
            <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock size={16} className="text-slate-500" /> Status Log
            </h3>

            <div className="space-y-4">
              {ticketDetails.statusHistory.map((history, idx) => (
                <div key={history._id || idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    {idx !== ticketDetails.statusHistory.length - 1 && (
                      <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800">
                      Status set to <span className="text-indigo-600">{history.status}</span>
                    </p>
                    <p className="text-gray-500">By: {history.changedBy?.name || 'System'}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(history.changedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;