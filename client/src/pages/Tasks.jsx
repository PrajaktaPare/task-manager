import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask, removeTask } from '../store/taskSlice';
import useTaskList from '../hooks/useTaskList';
import useToast from '../hooks/useToast';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { PlusIcon } from '../components/Icons';

export default function Tasks() {
  const dispatch = useDispatch();
  const toast = useToast();
  const currentUser = useSelector((state) => state.auth.user);
  const { tasks, total, pages, loading, error, filters, setFilter, setPage, resetFilters, refresh, hasActiveFilters } = useTaskList();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setFormOpen(true);
  };

  // these are passed to memoised cards, so they need a stable identity
  const openEdit = useCallback((task) => {
    setEditing(task);
    setFormError('');
    setFormOpen(true);
  }, []);
  const askDelete = useCallback((task) => setToDelete(task), []);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const cancelDelete = useCallback(() => setToDelete(null), []);

  const handleSave = async (data) => {
    setSaving(true);
    setFormError('');
    const action = editing ? editTask({ id: editing._id, data }) : addTask(data);
    const result = await dispatch(action);
    setSaving(false);

    if (result.error) {
      setFormError(result.payload || 'Could not save the task');
      return;
    }
    toast.success(editing ? 'Task updated' : 'Task created');
    setFormOpen(false);
    refresh();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(removeTask(toDelete._id));
    setDeleting(false);

    if (result.error) {
      toast.error(result.payload || 'Could not delete the task');
    } else {
      toast.success('Task deleted');
      // if that was the last item on the page, step back one page
      if (tasks.length === 1 && filters.page > 1) setPage(filters.page - 1);
      else refresh();
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} {total === 1 ? 'task' : 'tasks'} match your filters</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <PlusIcon width={16} height={16} /> New task
        </button>
      </div>

      <TaskFilters filters={filters} onChange={setFilter} onReset={resetFilters} showReset={hasActiveFilters} />

      <ErrorBanner message={error} onRetry={refresh} />

      {loading && tasks.length === 0 ? (
        <Spinner label="Loading tasks" />
      ) : tasks.length === 0 && !error ? (
        <div className="card px-6 py-12 text-center">
          <p className="font-semibold">{hasActiveFilters ? 'No tasks match those filters' : 'No tasks yet'}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {hasActiveFilters ? 'Try a different search or clear the filters.' : 'Create your first task to get the board going.'}
          </p>
        </div>
      ) : (
        <div className={`space-y-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={askDelete} />
          ))}
        </div>
      )}

      <Pagination page={filters.page} pages={pages} total={total} onPageChange={setPage} />

      <TaskFormModal
        open={formOpen}
        task={editing}
        currentUserId={currentUser?.id}
        saving={saving}
        serverError={formError}
        onSubmit={handleSave}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this task?"
        message={toDelete ? `"${toDelete.title}" will be removed for everyone. This cannot be undone.` : ''}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
