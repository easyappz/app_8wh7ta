import instance from './axios';

export const fetchMessages = ({ limit } = {}) => {
  const config = {};

  if (typeof limit === 'number' && limit > 0) {
    config.params = { limit };
  }

  return instance.get('/api/chat/messages', config).then((response) => response.data);
};

export const sendMessage = ({ text }) => {
  return instance
    .post('/api/chat/messages', { text })
    .then((response) => response.data);
};
