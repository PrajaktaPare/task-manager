import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/authSlice';
import useToast from '../hooks/useToast';
import { validateEmail } from '../utils/validators';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required',
    };
    setErrors(found);
    if (found.email || found.password) return;

    const result = await dispatch(login({ ...form, email: form.email.trim() }));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}`);
      navigate(location.state?.from || '/dashboard', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-center text-3xl font-bold tracking-tight">
          Task<span className="text-brand-600">Board</span>
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">Log in to see what your team is working on.</p>

        <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={handleChange} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" className={`input ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={handleChange} />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="h-4 w-4 accent-brand-600" />
            Keep me logged in for 30 days
          </label>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
