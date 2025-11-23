import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login as loginRequest } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Введите имя пользователя и пароль.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginRequest({ username, password });
      login(data.token, data.member);
      navigate('/', { replace: true });
    } catch (err) {
      let message = 'Неверное имя пользователя или пароль.';

      if (err && err.response && err.response.data) {
        const serverData = err.response.data;
        if (typeof serverData.detail === 'string' && serverData.detail) {
          message = serverData.detail;
        }
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <div
      data-easytag="id1-src/components/Auth/LoginPage.jsx"
      className="page-root"
    >
      <div className="page-card">
        <h1 className="page-title">Вход</h1>

        <form className="page-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="login-username">
              Имя пользователя
            </label>
            <input
              id="login-username"
              className="form-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Введите имя пользователя"
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="login-password">
              Пароль
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="button button-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="page-footer-text">
          <span>Нет аккаунта?</span>{' '}
          <button
            type="button"
            className="button button-link"
            onClick={handleGoToRegister}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};
