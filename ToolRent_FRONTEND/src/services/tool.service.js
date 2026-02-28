import httpClient from '../http-common';

const getAll = () => httpClient.get('/api/tools/getTools');

const create = (toolData, quantity, rut) => httpClient.post(`/api/tools/createTool/${quantity}/${rut}`, toolData);

const getStock = () => httpClient.get('/api/tools/stock');

const update = (tool, rut) => httpClient.put(`api/tools/updateTool/${tool.id}/${rut}`, tool);

const get = (id) => httpClient.get(`api/tools/getTool/${id}`);

const getAvailable = () => httpClient.get('/api/tools/available');

export default {
  getAll,
  create,
  getStock,
  update,
  get,
  getAvailable,
};