import React, { createContext, useContext, useEffect, useState } from 'react';

import { AUTH_MEMBER_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY } from '../constants/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      const storedMember = window.localStorage.getItem(AUTH_MEMBER_STORAGE_KEY);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedMember) {
        const parsed = JSON.parse(storedMember);
        setMember(parsed);
      }
    } catch (error) {
      // Ошибки чтения из localStorage не должны ломать приложение
      // Можно просто вывести их в консоль для отладки.
      // eslint-disable-next-line no-console
      console.error('Не удалось прочитать данные аутентификации из localStorage', error);
    }
  }, []);

  const login = (newToken, newMember) => {
    setToken(newToken);
    setMember(newMember || null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, newToken);
        if (newMember) {
          window.localStorage.setItem(
            AUTH_MEMBER_STORAGE_KEY,
            JSON.stringify(newMember)
          );
        } else {
          window.localStorage.removeItem(AUTH_MEMBER_STORAGE_KEY);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Не удалось сохранить данные аутентификации в localStorage', error);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setMember(null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(AUTH_MEMBER_STORAGE_KEY);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Не удалось удалить данные аутентификации из localStorage', error);
      }
    }
  };

  const updateMember = (nextMember) => {
    setMember(nextMember || null);

    if (typeof window !== 'undefined') {
      try {
        if (nextMember) {
          window.localStorage.setItem(
            AUTH_MEMBER_STORAGE_KEY,
            JSON.stringify(nextMember)
          );
        } else {
          window.localStorage.removeItem(AUTH_MEMBER_STORAGE_KEY);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Не удалось обновить данные профиля в localStorage', error);
      }
    }
  };

  const value = {
    token,
    member,
    login,
    logout,
    setMember: updateMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }

  return context;
};
