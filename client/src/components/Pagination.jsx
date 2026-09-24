import { memo } from 'react';

const Pagination = memo(function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-between gap-3 pt-2" aria-label="Pagination">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page {page} of {pages} ({total} tasks)
      </p>
      <div className="flex gap-2">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button className="btn-ghost" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </nav>
  );
});

export default Pagination;
