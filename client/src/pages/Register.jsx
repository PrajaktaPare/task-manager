import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../store/authSlice';
import useToast from '../hooks/useToast';
import { validateName, validateEmail, validatePassword } from '../utils/validators';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: form.confirmPassword !== form.password ? 'Passwords do not match' : '',
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    const result = await dispatch(
      register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    );
    if (register.fulfilled.match(result)) {
      toast.success('Account created. You are logged in.');
      navigate('/dashboard', { replace: true });
    }
  };

  const field = (name, label, type = 'text', autoComplete) => (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} type={type} autoComplete={autoComplete} className={`input ${errors[name] ? 'input-error' : ''}`} value={form[name]} onChange={handleChange} />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-center text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">It takes less than a minute.</p>

        <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>
          )}
          {field('name', 'Full name', 'text', 'name')}
          {field('email', 'Email', 'email', 'email')}
          {field('password', 'Password', 'password', 'new-password')}
          <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">
            At least 8 characters with upper and lower case letters, a number and a special character.
          </p>
          {field('confirmPassword', 'Confirm password', 'password', 'new-password')}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
