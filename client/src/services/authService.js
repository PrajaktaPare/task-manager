import api from './api';

export const registerUser = (payload) => api.post('/register', payload).then((r) => r.data);
export const loginUser = (payload) => api.post('/login', payload).then((r) => r.data);
export const getCurrentUser = () => api.get('/me').then((r) => r.data.user);
export const getAllUsers = () => api.get('/users').then((r) => r.data.users);
