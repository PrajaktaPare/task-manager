import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchTasks } from '../store/taskSlice';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { StatusBadge } from '../components/Badges';
import { formatDate } from '../utils/format';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { stats, statsLoading, items, loading, error } = useSelector((state) => state.tasks);

  const load = useCallback(() => {
    dispatch(fetchStats());
    dispatch(fetchTasks({ sort: 'newest', limit: 5, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const completion = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi {user?.name?.split(' ')[0]}, here's where things stand</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Numbers cover every task in the team.</p>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Task summary">
        <StatCard label="Total tasks" value={stats.total} accent="bg-slate-500" loading={statsLoading} />
        <StatCard label="Pending" value={stats.pending} accent="bg-amber-500" loading={statsLoading} />
        <StatCard label="In progress" value={stats.inProgress} accent="bg-sky-500" loading={statsLoading} />
        <StatCard label="Completed" value={stats.completed} accent="bg-emerald-500" loading={statsLoading} />
      </section>

      <section className="card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Overall completion</span>
          <span className="tabular-nums text-slate-500 dark:text-slate-400">{completion}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${completion}%` }} />
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold">Latest tasks</h2>
          <Link to="/tasks" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
        </div>

        {loading && items.length === 0 ? (
          <Spinner label="Loading tasks" />
        ) : items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No tasks yet. <Link to="/tasks" className="font-semibold text-brand-600 hover:underline">Create the first one.</Link>
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {items.map((task) => (
              <li key={task._id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <Link to={`/tasks/${task._id}`} className="block truncate text-sm font-medium hover:text-brand-600">{task.title}</Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Due {formatDate(task.dueDate)} · {task.assignedTo?.name}</p>
                </div>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
