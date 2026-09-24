import api from './api';

export const getTasks = (params) => api.get('/tasks', { params }).then((r) => r.data);
export const getTaskStats = () => api.get('/tasks/stats').then((r) => r.data);
export const getTaskById = (id) => api.get(`/tasks/${id}`).then((r) => r.data.task);
export const createTask = (data) => api.post('/tasks', data).then((r) => r.data.task);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data.task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
