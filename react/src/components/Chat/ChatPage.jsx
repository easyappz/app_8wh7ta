import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchMessages, sendMessage } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_LIMIT = 50;

export const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { member, logout } = useAuth();
  const navigate = useNavigate();

  const loadMessages = async () => {
    setError('');

    try {
      const data = await fetchMessages({ limit: DEFAULT_LIMIT });
      setMessages(data || []);
    } catch (err) {
      setError('Не удалось загрузить сообщения.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      try {
        const data = await fetchMessages({ limit: DEFAULT_LIMIT });
        if (!isMounted) {
          return;
        }
        setMessages(data || []);
      } catch (err) {
        if (isMounted) {
          setError('Не удалось загрузить сообщения.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialLoad();

    let intervalId = null;

    if (typeof window !== 'undefined') {
      intervalId = window.setInterval(() => {
        fetchMessages({ limit: DEFAULT_LIMIT })
          .then((data) => {
            if (isMounted) {
              setMessages(data || []);
            }
          })
          .catch(() => {
            // Ошибку периодической загрузки можно тихо игнорировать
          });
      }, 7000);
    }

    return () => {
      isMounted = false;
      if (intervalId !== null && typeof window !== 'undefined') {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const handleSend = async () => {
    const trimmed = newMessage.trim();

    if (!trimmed) {
      setSendError('Введите сообщение перед отправкой.');
      return;
    }

    setSendError('');
    setIsSending(true);

    try {
      const created = await sendMessage({ text: trimmed });
      setNewMessage('');

      // Добавляем новое сообщение в начало списка (новые сверху)
      setMessages((prev) => {
        if (!prev || prev.length === 0) {
          return [created];
        }
        return [created].concat(prev);
      });
    } catch (err) {
      setSendError('Не удалось отправить сообщение.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const formatTime = (value) => {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return String(value);
    }
  };

  return (
    <div
      data-easytag="id4-src/components/Chat/ChatPage.jsx"
      className="chat-layout"
    >
      <header className="chat-header">
        <div className="chat-header-left">
          <h1 className="chat-title">Групповой чат</h1>
        </div>
        <div className="chat-header-right">
          <div className="chat-user-info">
            <span className="chat-user-label">Пользователь:</span>{' '}
            <span className="chat-user-name">
              {member && member.username ? member.username : 'Неизвестно'}
            </span>
          </div>
          <div className="chat-header-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={handleGoToProfile}
            >
              Профиль
            </button>
            <button
              type="button"
              className="button button-outline"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="chat-main">
        {error && <div className="form-error form-error-block">{error}</div>}

        <div className="chat-messages" aria-label="Список сообщений чата">
          {isLoading && <div className="page-info-text">Загрузка сообщений...</div>}

          {!isLoading && messages.length === 0 && !error && (
            <div className="page-info-text">Сообщений пока нет. Напишите первое сообщение!</div>
          )}

          {!isLoading &&
            messages.length > 0 &&
            messages.map((message) => (
              <div key={message.id} className="chat-message">
                <div className="chat-message-meta">
                  <span className="chat-message-author">
                    {message.author_username}
                  </span>{' '}
                  <span className="chat-message-time">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <div className="chat-message-text">{message.text}</div>
              </div>
            ))}
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            rows={2}
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            type="button"
            className="button button-primary chat-send-button"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? 'Отправка...' : 'Отправить'}
          </button>
        </div>

        {sendError && <div className="form-error">{sendError}</div>}
      </main>
    </div>
  );
};
