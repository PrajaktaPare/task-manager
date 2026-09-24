import { useEffect, useState } from 'react';
import useUsers from '../hooks/useUsers';
import { validateTask } from '../utils/validators';
import { toInputDate } from '../utils/format';
import { CloseIcon } from './Icons';

const emptyForm = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '', assignedTo: '' };

// used for both "new task" and "edit task"
export default function TaskFormModal({ open, task, currentUserId, saving, serverError, onSubmit, onClose }) {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(task);

  // fill the form when opening
  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: toInputDate(task.dueDate),
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
      });
    } else {
      setForm({ ...emptyForm, assignedTo: currentUserId || '' });
    }
  }, [open, task, currentUserId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateTask(form);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  const fieldClass = (name) => `input ${errors[name] ? 'input-error' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center" onClick={onClose}>
      <form className="card w-full max-w-lg p-6" onSubmit={handleSubmit} noValidate onClick={(e) => e.stopPropagation()} aria-labelledby="task-form-title">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="task-form-title" className="text-lg font-bold">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input id="title" name="title" className={fieldClass('title')} value={form.title} onChange={handleChange} autoFocus />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" name="description" rows={3} className={fieldClass('description')} value={form.description} onChange={handleChange} />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="label">Priority</label>
              <select id="priority" name="priority" className="input" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select id="status" name="status" className="input" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="label">Due date</label>
              <input id="dueDate" name="dueDate" type="date" className={fieldClass('dueDate')} value={form.dueDate} onChange={handleChange} />
              {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}
            </div>
            <div>
              <label htmlFor="assignedTo" className="label">Assigned to</label>
              <select id="assignedTo" name="assignedTo" className={fieldClass('assignedTo')} value={form.assignedTo} onChange={handleChange} disabled={usersLoading}>
                <option value="">{usersLoading ? 'Loading users...' : 'Select a user'}</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              {errors.assignedTo && <p className="field-error">{errors.assignedTo}</p>}
              {usersError && <p className="field-error">{usersError}</p>}
            </div>
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{serverError}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
}
