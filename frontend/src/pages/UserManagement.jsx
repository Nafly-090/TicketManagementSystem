import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, createUser, updateUser, deleteUser, resetUserState } from '../store/slices/userSlice';
import { ShieldCheck, User, Users, UserPlus, Edit3, Trash2, X } from 'lucide-react';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector((state) => state.users);
  const loggedInUser = useSelector((state) => state.auth.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    dispatch(resetUserState());
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    dispatch(resetUserState());
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let resultAction;

    if (editingUser) {
      const payload = { name: formData.name, email: formData.email, role: formData.role };
      resultAction = await dispatch(updateUser({ id: editingUser._id, userData: payload }));
    } else {
      resultAction = await dispatch(createUser(formData));
    }

    if (createUser.fulfilled.match(resultAction) || updateUser.fulfilled.match(resultAction)) {
      setModalOpen(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (id === loggedInUser._id) {
      alert('You cannot delete your own Administrator account.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      await dispatch(deleteUser(id));
    }
  };

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: 'bg-rose-100 text-rose-800 border-rose-200',
      agent: 'bg-amber-100 text-amber-800 border-amber-200',
      user: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return styles[role] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-indigo-600" /> User Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review participants, promote agents, and direct user registrations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-xs"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-medium">Loading user list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Joined At</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                        {item.role === 'admin' ? <ShieldCheck size={16} className="text-rose-600" /> : <User size={16} />}
                      </div>
                      {item.name} {item._id === loggedInUser._id && <span className="text-[10px] text-indigo-500 font-bold ml-1">(You)</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${getRoleBadgeStyle(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(item._id, item.name)}
                        disabled={item._id === loggedInUser._id}
                        className={`p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors ${item._id === loggedInUser._id ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl border border-gray-150 relative space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Update Participant Credentials' : 'Add New Participant'}
              </h2>
              <p className="text-xs text-gray-500">Configure systemic access clearance.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. David Miller"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="name@company.com"
                />
              </div>

              {/* Password box visible on Create mode only */}
              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Account Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Assign Clearance Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                >
                  <option value="user">User (Client)</option>
                  <option value="agent">Support Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm transition-colors shadow-xs"
                >
                  {isLoading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;