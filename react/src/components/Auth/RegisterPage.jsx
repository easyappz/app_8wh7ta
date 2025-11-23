import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register as registerRequest } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Заполните все поля формы.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerRequest({ username, password });
      login(data.token, data.member);
      navigate('/', { replace: true });
    } catch (err) {
      let message = 'Не удалось завершить регистрацию.';

      if (err && err.response && err.response.data) {
        const serverData = err.response.data;

        if (serverData.username && Array.isArray(serverData.username)) {
          const first = serverData.username[0];
          if (typeof first === 'string' && first) {
            message = first;
          }
        } else if (typeof serverData.detail === 'string' && serverData.detail) {
          message = serverData.detail;
        }
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      data-easytag="id2-src/components/Auth/RegisterPage.jsx"
      className="page-root"
    >
      <div className="page-card">
        <h1 className="page-title">Регистрация</h1>

        <form className="page-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="register-username">
              Имя пользователя
            </label>
            <input
              id="register-username"
              className="form-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Введите имя пользователя"
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-password">
              Пароль
            </label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              autoComplete="new-password"
            />
          </div>

          <div className="form-field">
            <label
              className="form-label"
              htmlFor="register-confirm-password"
            >
              Подтверждение пароля
            </label>
            <input
              id="register-confirm-password"
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Повторите пароль"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="button button-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="page-footer-text">
          <span>Уже есть аккаунт?</span>{' '}
          <button
            type="button"
            className="button button-link"
            onClick={handleGoToLogin}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};
