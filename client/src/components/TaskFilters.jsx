import { memo } from 'react';
import { SearchIcon } from './Icons';

const TaskFilters = memo(function TaskFilters({ filters, onChange, onReset, showReset }) {
  return (
    <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width={16} height={16} />
        <input
          type="search"
          className="input pl-9!"
          placeholder="Search by title"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          aria-label="Search tasks by title"
        />
      </div>

      <select className="input" value={filters.status} onChange={(e) => onChange('status', e.target.value)} aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select className="input" value={filters.priority} onChange={(e) => onChange('priority', e.target.value)} aria-label="Filter by priority">
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select className="input" value={filters.sort} onChange={(e) => onChange('sort', e.target.value)} aria-label="Sort tasks">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueAsc">Due soonest</option>
        <option value="dueDesc">Due latest</option>
      </select>

      {showReset && (
        <button className="btn-ghost" onClick={onReset}>
          Clear
        </button>
      )}
    </div>
  );
});

export default TaskFilters;
