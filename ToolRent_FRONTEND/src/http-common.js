import axios from 'axios';
import keycloak from './services/keycloak';

const toolRentBackendServer = import.meta.env.VITE_TOOLRENT_BACKEND_SERVER;
const toolRentBackendPort = import.meta.env.VITE_TOOLRENT_BACKEND_PORT;

const api = axios.create({
  baseURL: `http://${toolRentBackendServer}:${toolRentBackendPort}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      await keycloak.updateToken(30);
      const { token } = keycloak;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;