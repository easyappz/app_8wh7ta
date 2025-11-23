import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getProfile, updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { logout, setMember } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getProfile();

        if (!isMounted) {
          return;
        }

        setProfile(data);
        setUsername(data.username || '');
        setMember({ id: data.id, username: data.username });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError('Не удалось загрузить профиль.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [setMember]);

  const handleSave = async () => {
    if (!username) {
      setError('Имя пользователя не может быть пустым.');
      setSuccessMessage('');
      return;
    }

    if (!profile) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updated = await updateProfile({ username });
      setProfile(updated);
      setMember({ id: updated.id, username: updated.username });
      setSuccessMessage('Профиль успешно сохранён.');
    } catch (err) {
      let message = 'Не удалось сохранить профиль.';

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
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const formatDateTime = (value) => {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      return date.toLocaleString('ru-RU');
    } catch (error) {
      return String(value);
    }
  };

  return (
    <div
      data-easytag="id3-src/components/Profile/ProfilePage.jsx"
      className="page-root"
    >
      <div className="page-card">
        <h1 className="page-title">Профиль</h1>

        {isLoading && <div className="page-info-text">Загрузка профиля...</div>}

        {!isLoading && profile && (
          <>
            <div className="form-field">
              <label className="form-label" htmlFor="profile-username">
                Имя пользователя
              </label>
              <input
                id="profile-username"
                className="form-input"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="form-field">
              <span className="form-label">Дата регистрации</span>
              <div className="form-static-value">
                {formatDateTime(profile.created_at)}
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}
            {successMessage && (
              <div className="form-success">{successMessage}</div>
            )}

            <div className="profile-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </>
        )}

        {!isLoading && !profile && !error && (
          <div className="page-info-text">Профиль не найден.</div>
        )}

        {!isLoading && error && (
          <div className="form-error form-error-block">{error}</div>
        )}
      </div>
    </div>
  );
};
