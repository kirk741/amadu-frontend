import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../assets/icons';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import client from '../../api/client';
import styles from './EmotionLogsPage.module.css';
import Input from '../../components/common/Input/Input';

const emotionTranslations = {
  'Happy': 'Счастье',
  'Fine': 'Удовлетворённость',
  'Ok': 'Нейтральность',
  'Sad': 'Грусть',
  'Angry': 'Раздражение'
};

const EmotionLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [popup, setPopup] = useState({ open: false, logId: null, left: 0, top: 0 });
  const [editModal, setEditModal] = useState({ open: false, log: null, newEmotionId: '', newDate: '' });
  const popupRef = useRef();

  const fetchEmotions = async () => {
    try {
      const res = await client('/emotions');
      setEmotions(res.data?.data || res.data || res);
    } catch (e) { console.error(e); }
  };

  const fetchLogs = async (url = '/emotion-logs?per_page=10') => {
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

  useEffect(() => { fetchEmotions(); fetchLogs(); }, []);

  const handleEditSave = async () => {
    const { log, newEmotionId, newDate } = editModal;
    const data = new FormData();
    data.append('emotion_id', newEmotionId);
    data.append('created_at', newDate);
    data.append('_method', 'PATCH'); // ФИКС CORS

    try {
      await client(`/emotion-logs/${log.id}`, { method: 'POST', body: data });
      setLogs(prev => prev.map(l => l.id === log.id ? { ...l, emotion_id: newEmotionId, created_at: newDate } : l));
      setEditModal({ open: false });
    } catch (e) { console.error(e); }
  };

  const formatDisplayDate = (iso) => {
    return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' г. в');
  };

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        {logs.map(log => {
          const emotion = emotions.find(e => e.id === log.emotion_id);
          return (
            <div key={log.id} className={styles.logItem}>
              <div className={styles.logContent}>
                <img src={`${process.env.REACT_APP_API_URL}/${emotion?.media?.[0]?.file_path}`} className={styles.icon} alt="" />
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
                  const r = e.currentTarget.getBoundingClientRect();
                  setPopup({ open: true, logId: log.id, left: r.left - 150, top: r.top });
                }}
              >
                <Icons.More />
              </Button>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={() => fetchLogs(nextPageUrl)}>{loadingMore ? 'Загрузка...' : 'Загрузить ещё'}</Button>
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
              <button key={em.id} type="button" className={`${styles.emotionBtn} ${editModal.newEmotionId === em.id ? styles.active : ''}`}
                onClick={() => setEditModal(p => ({ ...p, newEmotionId: em.id }))}>
                <img src={`${process.env.REACT_APP_API_URL}/${em.media?.[0]?.file_path}`} alt="" />
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
        <div className={styles.popup} style={{ left: popup.left, top: popup.top }} ref={popupRef}>
          <button onClick={() => {
            const log = logs.find(l => l.id === popup.logId);
            const date = new Date(log.created_at);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            setEditModal({ open: true, log, newEmotionId: log.emotion_id, newDate: date.toISOString().slice(0, 16) });
            setPopup({ open: false });
          }}>Редактировать</button>
          <button className={styles.delete} onClick={async () => {
            const d = new FormData(); d.append('_method', 'DELETE');
            await client(`/emotion-logs/${popup.logId}`, { method: 'POST', body: d });
            setLogs(prev => prev.filter(l => l.id !== popup.logId));
            setPopup({ open: false });
          }}>Удалить</button>
        </div>
      )}
    </div>
  );
};

export default EmotionLogsPage;