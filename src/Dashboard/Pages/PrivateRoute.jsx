// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('authToken')); // Replace with real auth check

  return isAuthenticated ? <Outlet /> : <Navigate to="/login"  />;
}
