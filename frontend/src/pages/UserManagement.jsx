import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../store/slices/userSlice';
import { ShieldCheck, User, Users } from 'lucide-react';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: 'bg-rose-100 text-rose-800 border-rose-200',
      agent: 'bg-amber-100 text-amber-800 border-amber-200',
      user: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return styles[role] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={24} className="text-indigo-600" /> User Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review system participants, audit account creations, and identify support agents.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600 font-medium">Loading user index...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500 bg-red-50 font-medium">Error: {message}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role System Designation</th>
                  <th className="px-6 py-4">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                        {item.role === 'admin' ? <ShieldCheck size={16} className="text-rose-600" /> : <User size={16} />}
                      </div>
                      {item.name}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;