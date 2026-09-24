import { NavLink } from 'react-router-dom';
import { DashboardIcon, TasksIcon, CloseIcon } from './Icons';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/tasks', label: 'Tasks', icon: TasksIcon },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink px-4 py-5 text-slate-200 transition-transform duration-200 dark:border-r dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Task<span className="text-brand-100">Board</span>
          </span>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto px-2 text-xs text-slate-400">Keep the team's work in one place.</p>
      </aside>
    </>
  );
}
