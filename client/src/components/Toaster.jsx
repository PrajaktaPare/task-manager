import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissToast } from '../store/uiSlice';

const styles = {
  success: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  error: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
  info: 'border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100',
};

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), 4000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div className={`flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 text-sm shadow-lg ${styles[toast.type]}`} role="status">
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => dispatch(dismissToast(toast.id))} className="opacity-60 hover:opacity-100" aria-label="Dismiss">×</button>
    </div>
  );
}

export default function Toaster() {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 [&>*]:pointer-events-auto" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
