import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="text-xl font-bold">We couldn't find that page</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">The link may be broken or the page may have been moved.</p>
      <Link to="/dashboard" className="btn-primary mt-2">Go to dashboard</Link>
    </div>
  );
}
