import httpClient from '../http-common';

export const getMovementsByTool = (toolId) => httpClient.get(`/api/kardex/tool/${toolId}`);

export const getMovementsByDateRange = (start, end) => {
  const startParam = encodeURIComponent(start);
  const endParam = encodeURIComponent(end);
  return httpClient.get(`/api/kardex/dates?start=${startParam}&end=${endParam}`);
};

export const getFiltered = (toolId, start, end) => {
  const startParam = encodeURIComponent(start);
  const endParam = encodeURIComponent(end);
  return httpClient.get(
    `/api/kardex/filter?toolId=${toolId}&start=${startParam}&end=${endParam}`,
  );
};

export const getAllMovements = () => httpClient.get('/api/kardex/all');

export default {
  getMovementsByTool,
  getMovementsByDateRange,
  getFiltered,
  getAllMovements,
};
