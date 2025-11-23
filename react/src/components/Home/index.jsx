import React from 'react';

import { ChatPage } from '../Chat/ChatPage';

/**
 * Главная страница приложения использует компонент группового чата.
 */
export const Home = () => {
  return (
    <div data-easytag="id1-src/components/Home/index.jsx" className="home-wrapper">
      <ChatPage />
    </div>
  );
};
