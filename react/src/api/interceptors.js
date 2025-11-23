import instance from './axios';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth';

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const storedToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

        if (storedToken) {
          const updatedConfig = { ...config };
          updatedConfig.headers = updatedConfig.headers || {};
          updatedConfig.headers.Authorization = 'Token ' + storedToken;
          return updatedConfig;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Не удалось прочитать токен из localStorage', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
