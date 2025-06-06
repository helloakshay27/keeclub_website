import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
