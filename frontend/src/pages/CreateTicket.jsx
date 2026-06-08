import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../store/slices/ticketSlice';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Bug',
    priority: 'Low',
  });
  const { title, description, category, priority } = formData;
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.tickets);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !description.trim()) {
      setValidationError('Please fill in all text fields.');
      return;
    }

    const resultAction = await dispatch(createTicket(formData));
    if (createTicket.fulfilled.match(resultAction)) {
      navigate('/tickets');
    } else {
      setValidationError(resultAction.payload || 'Failed to submit support ticket.');
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-xs border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
        <p className="text-sm text-gray-600 mt-1">Submit your request and our support team will respond shortly.</p>
      </div>

      {validationError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {validationError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Title</label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Brief summary of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Context</label>
          <textarea
            name="description"
            required
            rows="5"
            value={description}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide clear steps to reproduce or details about your request..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={category}
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
              value={priority}
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
            {isLoading ? 'Submitting...' : 'Submit Ticket'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;