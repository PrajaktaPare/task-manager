import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import useTheme from '../hooks/useTheme';
import useToast from '../hooks/useToast';
import { MenuIcon, SunIcon, MoonIcon, LogoutIcon } from './Icons';

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have been logged out');
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
      <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <MenuIcon />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role}</p>
          </div>
        </div>

        <button className="btn-ghost px-3!" onClick={handleLogout}>
          <LogoutIcon width={16} height={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
