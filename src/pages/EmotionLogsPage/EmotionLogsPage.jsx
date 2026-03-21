import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../assets/icons';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import client from '../../api/client';
import styles from './EmotionLogsPage.module.css';
import Input from '../../components/common/Input/Input';
import { getOfflineLogs } from '../../utils/offlineStorage';

const emotionTranslations = {
  'Happy': 'Счастье',
  'Fine': 'Удовлетворённость',
  'Ok': 'Нейтральность',
  'Sad': 'Грусть',
  'Angry': 'Раздражение'
};

const EmotionLogsPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [popup, setPopup] = useState({ open: false, logId: null, left: 0, top: 0 });
  const [editModal, setEditModal] = useState({ open: false, log: null, newEmotionId: '', newDate: '' });
  const popupRef = useRef();

  const isAuthenticated = () => !!localStorage.getItem('token');

  const fetchEmotions = async () => {
    try {
      const res = await client('/emotions');
      setEmotions(res.data?.data || res.data || res);
    } catch (e) { console.error(e); }
  };

  const fetchLogs = async (url = '/emotion-logs?per_page=10') => {
    if (!isAuthenticated()) {
      setLogs(getOfflineLogs());
      setLoading(false);
      setHasMore(false);
      return;
    }
    if (url.includes('per_page')) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await client(url);
      const data = res.data;
      setLogs(prev => url.includes('per_page') ? data.data : [...prev, ...data.data]);
      setNextPageUrl(data.next_page_url ? new URL(data.next_page_url).pathname + new URL(data.next_page_url).search : null);
      setHasMore(!!data.next_page_url);
    } catch (e) { console.error(e); } finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => {
    fetchEmotions();
    fetchLogs();
  }, []);

  // Закрытие попапа при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popup.open && popupRef.current && !popupRef.current.contains(event.target)) {
        setPopup({ open: false, logId: null, left: 0, top: 0 });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popup.open]);

  const handleEditSave = async () => {
    const { log, newEmotionId, newDate } = editModal;
    if (!isAuthenticated()) {
      const updatedLogs = logs.map(l =>
        l.id === log.id ? { ...l, emotion_id: newEmotionId, created_at: newDate } : l
      );
      setLogs(updatedLogs);
      localStorage.setItem('offline_emotion_logs', JSON.stringify(updatedLogs));
      setEditModal({ open: false });
      return;
    }
    const data = new FormData();
    data.append('emotion_id', newEmotionId);
    data.append('created_at', newDate);
    data.append('_method', 'PATCH');
    try {
      await client(`/emotion-logs/${log.id}`, { method: 'POST', body: data });
      setLogs(prev => prev.map(l => l.id === log.id ? { ...l, emotion_id: newEmotionId, created_at: newDate } : l));
      setEditModal({ open: false });
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (logId) => {
    if (!isAuthenticated()) {
      const updatedLogs = logs.filter(l => l.id !== logId);
      setLogs(updatedLogs);
      localStorage.setItem('offline_emotion_logs', JSON.stringify(updatedLogs));
      setPopup({ open: false });
      return;
    }
    const data = new FormData();
    data.append('_method', 'DELETE');
    try {
      await client(`/emotion-logs/${logId}`, { method: 'POST', body: data });
      setLogs(prev => prev.filter(l => l.id !== logId));
      setPopup({ open: false });
    } catch (e) { console.error(e); }
  };

  const formatDisplayDate = (iso) => {
    return new Date(iso).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' г. в');
  };

  const getImageUrl = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    if (filePath.startsWith('storage/')) return `${process.env.REACT_APP_API_URL}/${filePath}`;
    return `${process.env.REACT_APP_API_URL}/${filePath}`;
  };

  if (loading && !logs.length) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        {logs.map(log => {
          const emotion = emotions.find(e => e.id === log.emotion_id);
          const imgSrc = getImageUrl(emotion?.media?.[0]?.file_path);
          return (
            <div key={log.id} className={styles.logItem}>
              <div className={styles.logContent}>
                {imgSrc && <img src={imgSrc} className={styles.icon} alt="" />}
                <div className={styles.info}>
                  <span className={styles.name}>
                    {emotionTranslations[emotion?.name] || emotion?.name || '---'}
                  </span>
                  <span className={styles.date}>{formatDisplayDate(log.created_at)}</span>
                </div>
              </div>
              <Button
                noBg
                shadowType={null}
                className={styles.moreButton}
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPopup({
                    open: true,
                    logId: log.id,
                    left: rect.left - 150,
                    top: rect.top,
                  });
                }}
              >
                <Icons.More />
              </Button>
            </div>
          );
        })}
      </div>

      {hasMore && isAuthenticated() && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={() => fetchLogs(nextPageUrl)}>
            {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </Button>
        </div>
      )}

      <Modal
        isOpen={editModal.open}
        title="Редактирование записи"
        onConfirm={handleEditSave}
        onCancel={() => setEditModal({ open: false })}
      >
        <div className={styles.modalBody}>
          <div className={styles.emotionGrid}>
            {emotions.map(em => (
              <button
                key={em.id}
                type="button"
                className={`${styles.emotionBtn} ${editModal.newEmotionId === em.id ? styles.active : ''}`}
                onClick={() => setEditModal(p => ({ ...p, newEmotionId: em.id }))}
              >
                <img src={getImageUrl(em.media?.[0]?.file_path)} alt={em.name} />
              </button>
            ))}
          </div>
          <Input
            type="datetime-local"
            value={editModal.newDate}
            onChange={e => setEditModal(p => ({ ...p, newDate: e.target.value }))}
            className={styles.customInput}
          />
        </div>
      </Modal>

      {popup.open && (
        <div
          ref={popupRef}
          className={styles.popup}
          style={{ left: popup.left, top: popup.top }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const log = logs.find(l => l.id === popup.logId);
              if (log) {
                const date = new Date(log.created_at);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                setEditModal({
                  open: true,
                  log,
                  newEmotionId: log.emotion_id,
                  newDate: date.toISOString().slice(0, 16)
                });
                setPopup({ open: false });
              }
            }}
          >
            Редактировать
          </button>
          <button className={styles.delete} onClick={() => handleDelete(popup.logId)}>
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionLogsPage;