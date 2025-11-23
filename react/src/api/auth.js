import instance from './axios';

export const register = ({ username, password }) => {
  return instance
    .post('/api/auth/register', { username, password })
    .then((response) => response.data);
};

export const login = ({ username, password }) => {
  return instance
    .post('/api/auth/login', { username, password })
    .then((response) => response.data);
};

export const getProfile = () => {
  return instance.get('/api/auth/profile').then((response) => response.data);
};

export const updateProfile = (data) => {
  // Используем PUT для полного обновления профиля
  return instance
    .put('/api/auth/profile', data)
    .then((response) => response.data);
};
