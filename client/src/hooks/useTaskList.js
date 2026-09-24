import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchStats } from '../store/taskSlice';
import useDebounce from './useDebounce';

export const PAGE_SIZE = 8;

const defaultFilters = { search: '', status: '', priority: '', sort: 'newest', page: 1 };

// keeps the filters, debounced search and fetching in one place for the Tasks page
export default function useTaskList() {
  const dispatch = useDispatch();
  const { items, total, pages, loading, error } = useSelector((state) => state.tasks);
  const [filters, setFilters] = useState(defaultFilters);

  const debouncedSearch = useDebounce(filters.search, 400);

  // build the query params only when something actually changed
  const params = useMemo(() => {
    const p = { sort: filters.sort, page: filters.page, limit: PAGE_SIZE };
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    if (filters.status) p.status = filters.status;
    if (filters.priority) p.priority = filters.priority;
    return p;
  }, [debouncedSearch, filters.status, filters.priority, filters.sort, filters.page]);

  useEffect(() => {
    dispatch(fetchTasks(params));
  }, [dispatch, params]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // any filter change goes back to page 1
  }, []);

  const setPage = useCallback((page) => setFilters((prev) => ({ ...prev, page })), []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  // called after create / edit / delete so the list and the counts stay fresh
  const refresh = useCallback(() => {
    dispatch(fetchTasks(params));
    dispatch(fetchStats());
  }, [dispatch, params]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority);

  return { tasks: items, total, pages, loading, error, filters, setFilter, setPage, resetFilters, refresh, hasActiveFilters };
}
