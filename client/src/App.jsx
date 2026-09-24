import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, logout } from './store/authSlice';
import useToast from './hooks/useToast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Toaster from './components/Toaster';
import Spinner from './components/Spinner';

// every page is its own chunk, only downloaded when the user opens it
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token = useSelector((state) => state.auth.token);

  // when we reopen the app with a saved token, check it is still valid
  useEffect(() => {
    if (token) dispatch(fetchMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // axios fires this when the API answers 401 (expired or invalid JWT)
  useEffect(() => {
    const handleExpired = () => {
      dispatch(logout());
      toast.error('Your session has expired. Please log in again.');
      navigate('/login', { replace: true });
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [dispatch, navigate, toast]);

  return (
    <>
      <Suspense fallback={<Spinner label="Loading" className="min-h-screen" />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
