import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats, fetchTickets } from '../store/slices/ticketSlice';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ClipboardList, Flame, AlertCircle, CheckCircle, 
  Clock, ArrowRight, FilePlus, HelpCircle 
} from 'lucide-react';
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { stats, tickets, isLoading, isError, message } = useSelector((state) => state.tickets || {});

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchTickets({ limit: 5 }));
  }, [dispatch]);

  if (isLoading && (!stats || !tickets)) {
    return <div className="text-gray-600 font-medium">Loading control center...</div>;
  }

  if (isError) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {message}</div>;
  }

  const total = stats?.total || 0;
  const status = stats?.statusCounts || { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
  const priority = stats?.priorityCounts || { Low: 0, Medium: 0, High: 0, Urgent: 0 };

  const totalWork = status.Open + status['In Progress'] + status.Resolved + status.Closed;
  const resolutionPercentage = totalWork > 0 ? Math.round((status.Resolved / totalWork) * 100) : 0;

  const getActivityLog = () => {
    const activities = [];
    tickets.forEach((t) => {
      t.statusHistory.forEach((history) => {
        activities.push({
          ticketId: t._id,
          ticketNumber: t.ticketNumber,
          title: t.title,
          status: history.status,
          by: history.changedBy?.name || 'System',
          date: new Date(history.changedAt),
        });
      });
    });
    return activities.sort((a, b) => b.date - a.date).slice(0, 5);
  };

  const activityLog = getActivityLog();

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

  const cards = [
    { title: 'Total Tickets', count: total, color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: ClipboardList },
    { title: 'Open Backlog', count: status.Open, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: AlertCircle },
    { title: 'In Progress', count: status['In Progress'], color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Flame },
    { title: 'Resolved Cases', count: status.Resolved, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-gray-100 rounded-xl shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Portal Control Center</h1>
          <p className="text-sm text-gray-600 mt-1">
            Logged in as <strong className="text-indigo-600 capitalize">{user?.name} ({user?.role})</strong>
          </p>
        </div>
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
          Clearance Level: {user?.role}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`p-6 border rounded-xl shadow-xs flex items-center justify-between ${card.color}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-85">{card.title}</p>
                <p className="text-3xl font-extrabold mt-2 tracking-tight">{card.count}</p>
              </div>
              <div className="p-2 bg-white/40 rounded-lg">
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {user?.role === 'admin' && (
          <>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-md font-bold text-gray-900">Priority Volume Distribution</h3>
                <p className="text-xs text-gray-500">Live graphical indexing of system workload weight.</p>
              </div>
              
              <div className="space-y-4 pt-4">
                {Object.keys(priority).map((prio) => {
                  const count = priority[prio] || 0;
                  const maxVal = Math.max(...Object.values(priority), 1);
                  const percentageWidth = Math.min((count / maxVal) * 100, 100);

                  const barColors = {
                    Low: 'bg-gray-400',
                    Medium: 'bg-blue-500',
                    High: 'bg-amber-500',
                    Urgent: 'bg-rose-500',
                  };

                  return (
                    <div key={prio} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span className="flex items-center gap-1.5 capitalize">
                          <span className={`w-2 h-2 rounded-full ${barColors[prio]}`} /> {prio}
                        </span>
                        <span>{count} tickets</span>
                      </div>
                      <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${barColors[prio]}`}
                          style={{ width: `${percentageWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600" /> System Activity Log
                </h3>
                <p className="text-xs text-gray-500">Real-time status transitions and assignments.</p>
              </div>

              {activityLog.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Waiting for incoming logs...</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {activityLog.map((log, index) => (
                    <div key={index} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        {index !== activityLog.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 my-1" />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">
                          {log.by} updated <Link to={`/tickets/${log.ticketId}`} className="text-indigo-600 font-bold">{log.ticketNumber}</Link>
                        </p>
                        <p className="text-gray-500">
                          Status marked as <span className="font-bold">{log.status}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">{log.date.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {user?.role === 'agent' && (
          <>
            {/* My Pending Workload Table (Left column, spanning 2 grid spaces) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-gray-900">My Active Workload</h3>
                  <p className="text-xs text-gray-500">Your 5 most recently assigned unresolved tickets.</p>
                </div>
                <Link to="/tickets" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View List <ArrowRight size={14} />
                </Link>
              </div>

              {tickets.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-6">You have no pending tickets assigned at this time.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tickets.slice(0, 5).map((ticket) => (
                        <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-indigo-600">
                            <Link to={`/tickets/${ticket._id}`}>{ticket.ticketNumber}</Link>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 max-w-xs truncate">{ticket.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-md font-bold text-gray-900">Work Completion Index</h3>
                <p className="text-xs text-gray-500">Resolved tickets vs. overall assignments.</p>
              </div>

              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-gray-100 fill-none" strokeWidth="8" />
                    <circle 
                      cx="56" cy="56" r="48" 
                      className="stroke-emerald-500 fill-none transition-all duration-1000" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - resolutionPercentage / 100)}
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-gray-900 tracking-tight">{resolutionPercentage}%</span>
                </div>
                <p className="text-xs text-center font-medium text-gray-600">
                  {status.Resolved} Resolved / {totalWork} Assigned
                </p>
              </div>
            </div>
          </>
        )}

        {user?.role === 'user' && (
          <>
            {/* My Recent Tickets Preview */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-gray-900">My Support Requests</h3>
                  <p className="text-xs text-gray-500">Status indexing of your 5 most recent submissions.</p>
                </div>
                <Link to="/tickets" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {tickets.length === 0 ? (
                <div className="py-8 text-center text-gray-500 italic text-sm">
                  You have not submitted any support tickets yet. Click "Create Ticket" to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Issue Summary</th>
                        <th className="px-4 py-3">Urgency</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tickets.slice(0, 5).map((ticket) => (
                        <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-indigo-600">
                            <Link to={`/tickets/${ticket._id}`}>{ticket.ticketNumber}</Link>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 max-w-xs truncate">{ticket.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-850 text-white rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-md font-bold tracking-tight">Need immediate technical help?</h4>
                  <p className="text-xs opacity-80 mt-1">Submit a high-priority ticket and our specialized engineering agents will review it instantly.</p>
                </div>
                <button
                  onClick={() => navigate('/tickets/create')}
                  className="w-full py-2.5 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FilePlus size={14} /> Submit a Support Ticket
                </button>
              </div>

              <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <HelpCircle size={16} className="text-gray-400" /> Portal Quick Help
                </h4>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800">How long does resolution take?</p>
                    <p className="opacity-85">Urgent cases are audited within 2 hours, standard cases within 24 hours.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800">Who is handling my ticket?</p>
                    <p className="opacity-85">Administrators allocate cases to expert engineers who then appear inside your ticket metadata details.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;