import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../services/taskService';
import { getErrorMessage } from '../services/api';

const wrap = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });

export const fetchTasks = wrap('tasks/fetchTasks', (params) => taskService.getTasks(params));
export const fetchStats = wrap('tasks/fetchStats', () => taskService.getTaskStats());
export const addTask = wrap('tasks/addTask', (data) => taskService.createTask(data));
export const editTask = wrap('tasks/editTask', ({ id, data }) => taskService.updateTask(id, data));
export const removeTask = wrap('tasks/removeTask', (id) => taskService.deleteTask(id));

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    pages: 1,
    stats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.tasks;
        state.total = payload.total;
        state.page = payload.page;
        state.pages = payload.pages;
      })
      .addCase(fetchTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, { payload }) => {
        state.statsLoading = false;
        state.stats = payload;
      })
      .addCase(fetchStats.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});

export default taskSlice.reducer;
