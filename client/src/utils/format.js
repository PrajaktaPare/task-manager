export const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// date input wants yyyy-mm-dd
export const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const isOverdue = (task) =>
  task.status !== 'completed' && new Date(task.dueDate) < new Date(new Date().toDateString());

export const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };
