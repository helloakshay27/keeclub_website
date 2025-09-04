import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('salesforce_access_token'));
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
