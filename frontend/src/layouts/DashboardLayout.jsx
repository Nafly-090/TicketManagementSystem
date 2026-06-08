import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, Ticket, Users, FilePlus, LogOut, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Define dynamic menus based on role
  const getMenuItems = () => {
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'agent', 'user'] },
      { name: 'Create Ticket', path: '/tickets/create', icon: FilePlus, roles: ['user'] },
      { name: 'My Tickets', path: '/tickets', icon: Ticket, roles: ['user'] },
      { name: 'Assigned Tickets', path: '/tickets', icon: Ticket, roles: ['agent'] },
      { name: 'All Tickets', path: '/tickets', icon: Ticket, roles: ['admin'] },
      { name: 'User Management', path: '/users', icon: Users, roles: ['admin'] },
    ];
    return items.filter((item) => item.roles.includes(user?.role));
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-850">
          <Link to="/dashboard" className="text-xl font-bold text-white tracking-wider">
            QTechy Portal
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Nav Link Group */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile details and Logout */}
        <div className="p-4 bg-slate-950 border-t border-slate-850">
          <div className="mb-4">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full capitalize">
              {user?.role} Portal
            </span>
          </div>
        </header>

        {/* Dynamic Nested Screen Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;