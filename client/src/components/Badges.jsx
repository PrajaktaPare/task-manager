import { memo } from 'react';
import { STATUS_LABELS, PRIORITY_LABELS } from '../utils/format';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  'in-progress': 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
};

const priorityStyles = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  high: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
};

const pill = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold';

export const StatusBadge = memo(function StatusBadge({ status }) {
  return <span className={`${pill} ${statusStyles[status]}`}>{STATUS_LABELS[status]}</span>;
});

export const PriorityBadge = memo(function PriorityBadge({ priority }) {
  return <span className={`${pill} ${priorityStyles[priority]}`}>{PRIORITY_LABELS[priority]} priority</span>;
});
