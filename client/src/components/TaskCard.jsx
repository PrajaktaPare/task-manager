import { memo } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './Badges';
import { CalendarIcon, EditIcon, TrashIcon } from './Icons';
import { formatDate, isOverdue } from '../utils/format';

// memo + stable callbacks from the parent means unchanged cards don't re-render
const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <article className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <Link to={`/tasks/${task._id}`} className="block truncate text-base font-semibold hover:text-brand-600">
          {task.title}
        </Link>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <CalendarIcon width={14} height={14} />
            {overdue ? 'Overdue, ' : 'Due '}
            {formatDate(task.dueDate)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">for {task.assignedTo?.name || 'Unassigned'}</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button className="btn-ghost px-3!" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
          <EditIcon width={16} height={16} />
        </button>
        <button className="btn-ghost px-3! hover:border-red-300! hover:text-red-600!" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
          <TrashIcon width={16} height={16} />
        </button>
      </div>
    </article>
  );
});

export default TaskCard;
