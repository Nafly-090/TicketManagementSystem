import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../store/slices/ticketSlice';
import { ClipboardList, Flame, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, isError, message } = useSelector((state) => state.tickets || {});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-gray-600 font-medium">Loading dashboard metrics...</div>;
  }

  if (isError) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {message}</div>;
  }

  // Fallback defaults if stats are empty
  const total = stats?.total || 0;
  const status = stats?.statusCounts || { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
  const priority = stats?.priorityCounts || { Low: 0, Medium: 0, High: 0, Urgent: 0 };

  const cards = [
    { title: 'Total Tickets', count: total, color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: ClipboardList },
    { title: 'Open', count: status.Open, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: AlertCircle },
    { title: 'In Progress', count: status['In Progress'], color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Flame },
    { title: 'Resolved', count: status.Resolved, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle },
    { title: 'Urgent Priority', count: priority.Urgent, color: 'bg-rose-50 border-rose-200 text-rose-700', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-sm text-gray-600 mt-1">Here is the real-time support status summary for your role.</p>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`p-6 border rounded-xl shadow-xs flex items-center justify-between ${card.color}`}>
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase opacity-80">{card.title}</p>
                <p className="text-3xl font-extrabold mt-2">{card.count}</p>
              </div>
              <div className="p-2 bg-white/40 rounded-lg">
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;