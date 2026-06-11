import { useState, useEffect, useRef } from 'react'; // <-- Added useRef
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchTicketDetails, updateTicket } from '../store/slices/ticketSlice';
import { ArrowLeft } from 'lucide-react';

const EditTicket = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticketDetails, isLoading, isError, message } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
  });

  const [validationError, setValidationError] = useState('');
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    hasInitialized.current = false;
  }, [id]);

  useEffect(() => {
    if (!ticketDetails || ticketDetails._id !== id) {
      dispatch(fetchTicketDetails(id));
    } else if (!hasInitialized.current) {
      setFormData({
        title: ticketDetails.title,
        description: ticketDetails.description,
        category: ticketDetails.category,
        priority: ticketDetails.priority,
      });
      hasInitialized.current = true;
    }
  }, [dispatch, id, ticketDetails]);

  useEffect(() => {
    if (ticketDetails && user) {
      const isCreator = ticketDetails.createdBy._id === user._id;
      const isAdmin = user.role === 'admin';
      if (!isCreator && !isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [ticketDetails, user, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setValidationError('Please fill in all text fields.');
      return;
    }

    const resultAction = await dispatch(updateTicket({ id, ticketData: formData }));
    if (updateTicket.fulfilled.match(resultAction)) {
      navigate(`/tickets/${id}`);
    } else {
      setValidationError(resultAction.payload || 'Failed to update support ticket.');
    }
  };

  if (isLoading && !formData.title) {
    return <div className="text-gray-600 font-medium">Loading ticket details...</div>;
  }

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-xs border border-gray-100">
      <div className="mb-6">
        <Link to={`/tickets/${id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 mb-4">
          <ArrowLeft size={16} /> Back to Details
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Support Ticket</h1>
        <p className="text-sm text-gray-600 mt-1">Modify your request parameters below.</p>
      </div>

      {validationError || isError ? (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {validationError || message}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Context</label>
          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              className="block w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Account Issue">Account Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={onChange}
              className="block w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tickets/${id}`)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicket;