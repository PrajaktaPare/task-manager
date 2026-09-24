import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTaskById, updateTask, deleteTask } from '../services/taskService';
import { getErrorMessage } from '../services/api';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmDialog from '../components/ConfirmDialog';
import TaskFormModal from '../components/TaskFormModal';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { ArrowLeftIcon, EditIcon, TrashIcon } from '../components/Icons';
import { formatDate, isOverdue } from '../utils/format';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = useSelector((state) => state.auth.user);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTask(await getTaskById(id));
    } catch (err) {
      setError(getErrorMessage(err)); // 404 for unknown ids, 400 for malformed ones
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    setSaving(true);
    setFormError('');
    try {
      setTask(await updateTask(id, data));
      toast.success('Task updated');
      setEditOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      navigate('/tasks', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const closeEdit = useCallback(() => setEditOpen(false), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  if (loading) return <Spinner label="Loading task" />;

  if (error || !task) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={error || 'Task not found'} onRetry={load} />
        <Link to="/tasks" className="btn-ghost inline-flex">Back to tasks</Link>
      </div>
    );
  }

  const overdue = isOverdue(task);

  return (
    <div className="space-y-5">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400">
        <ArrowLeftIcon width={16} height={16} /> All tasks
      </Link>

      <article className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => { setFormError(''); setEditOpen(true); }}>
              <EditIcon width={16} height={16} /> Edit
            </button>
            <button className="btn-ghost hover:border-red-300! hover:text-red-600!" onClick={() => setConfirmOpen(true)}>
              <TrashIcon width={16} height={16} /> Delete
            </button>
          </div>
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {task.description || 'No description added.'}
        </p>

        <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800 sm:grid-cols-2">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Due date</dt>
            <dd className={`font-semibold ${overdue ? 'text-red-600 dark:text-red-400' : ''}`}>
              {formatDate(task.dueDate)}{overdue && ' (overdue)'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Assigned to</dt>
            <dd className="font-semibold">{task.assignedTo?.name} <span className="font-normal text-slate-500">({task.assignedTo?.email})</span></dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Created by</dt>
            <dd className="font-semibold">{task.createdBy?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Created on</dt>
            <dd className="font-semibold">{formatDate(task.createdAt)}</dd>
          </div>
        </dl>
      </article>

      <TaskFormModal open={editOpen} task={task} currentUserId={currentUser?.id} saving={saving} serverError={formError} onSubmit={handleSave} onClose={closeEdit} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        message={`"${task.title}" will be removed for everyone. This cannot be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </div>
  );
}
