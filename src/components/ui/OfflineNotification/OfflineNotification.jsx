import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OfflineNotification.module.css';

const OfflineNotification = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>Вы не в сети</h2>
        <p>Похоже, пропало подключение к интернету. Функции приложения временно недоступны.</p>
      </div>
    </div>
  );
};

export default OfflineNotification;
