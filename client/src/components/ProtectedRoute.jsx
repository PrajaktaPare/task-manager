import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// sends people to /login if there is no token, and remembers where they wanted to go
export default function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
