import httpClient from '../http-common';

export const getAllClients = () => httpClient.get('/api/users/getUsers');

export const createUser = (data) => httpClient.post('/api/users/createUser', data);

export const get = (id) => httpClient.get(`/api/users/${id}`);

export const updateUserStatus = (userId, finePaid) =>
  httpClient.put(`/api/users/${userId}/status?finePaid=${finePaid}`);

export const updateUser = (userId, data) => httpClient.put(`/api/users/${userId}`, data);

export default {
  getAllClients,
  createUser,
  get,
  updateUserStatus,
  updateUser,
};