import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Real Functional Components
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Common dashboard accessible to all authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Ticket List accessible to all roles */}
            <Route path="/tickets" element={<TicketList />} />
            
            {/* Create Ticket — Users only */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/tickets/create" element={<CreateTicket />} />
            </Route>

            {/* Ticket Details — All Roles */}
            <Route path="/tickets/:id" element={<TicketDetails />} />

            {/* Admin-Only User Management Screen */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback Catch-all Route redirecting to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;