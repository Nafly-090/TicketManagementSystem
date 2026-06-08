import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // If user is not logged in, redirect them to the Login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in user role does not match allowed paths, redirect to dashboard root
    return <Navigate to="/dashboard" replace />;
  }

  // If validation passes, render child routes
  return <Outlet />;
};

export default ProtectedRoute;