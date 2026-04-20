import api from './api';

export const adminLogin = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const getUsers = (page = 1, limit = 20) =>
  api.get(`/users?page=${page}&limit=${limit}`).then(r => r.data);

export const updateUser = (id: string, data: Partial<{ enabled: boolean; activated: boolean }>) =>
  api.patch(`/users/${id}`, data).then(r => r.data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`).then(r => r.data);

export const getBooks = (limit = 100) =>
  api.get(`/books/popular?limit=${limit}`).then(r => r.data);

export const getBookById = (id: string) =>
  api.get(`/books/${id}`).then(r => r.data);

export const updateBook = (id: string, data: Record<string, unknown>) =>
  api.patch(`/books/${id}`, data).then(r => r.data);

export const deleteBook = (id: string) =>
  api.delete(`/books/${id}`).then(r => r.data);

export const getStats = () =>
  api.get('/admin/stats').then(r => r.data);
