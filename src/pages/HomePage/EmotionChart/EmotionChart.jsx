import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../../assets/icons';
import client from '../../../api/client.js';
import styles from './EmotionChart.module.css';
import Button from '../../../components/common/Button/Button.jsx';
import { getOfflineLogs, saveOfflineLog } from '../../utils/offlineStorage';

const fetchAllPages = async (url) => {
  const response = await client(url);
  const pagination = response.data;
  const items = pagination.data || pagination || [];
  const nextUrl = pagination.next_page_url;
  if (nextUrl) {
    const urlObj = new URL(nextUrl);
    const relativePath = urlObj.pathname + urlObj.search;
    const nextItems = await fetchAllPages(relativePath);
    return [...items, ...nextItems];
  }
  return items;
};

const EmotionChart = () => {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState([]);
  const [emotionsLoaded, setEmotionsLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoaded, setLogsLoaded] = useState(false);

  const isAuthenticated = () => !!localStorage.getItem('token');

  const getEmotionCounts = () => {
    if (!logs.length) return {};
    const counts = {};
    logs.forEach(log => {
      const emotionId = log.emotion_id;
      counts[emotionId] = (counts[emotionId] || 0) + 1;
    });
    return counts;
  };

  const getMaxCount = (counts) => {
    const values = Object.values(counts);
    return values.length ? Math.max(...values) : 0;
  };

  const createEmotionLog = async (emotionId) => {
    try {
      const newLog = {
        id: Date.now(),
        emotion_id: emotionId,
        created_at: new Date().toISOString(),
      };
      if (isAuthenticated()) {
        await client('/emotion-logs', {
          method: 'POST',
          body: { emotion_id: emotionId, created_at: newLog.created_at },
        });
        const allLogs = await fetchAllPages('/emotion-logs?per_page=100');
        setLogs(allLogs);
      } else {
        saveOfflineLog(newLog);
        setLogs(prev => [...prev, newLog]);
      }
      setLogsLoaded(true);
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }
  };

  const goToLogsList = () => {
    navigate('/emotion-logs');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emotionsResponse = await client('/emotions');
        const emotionsData = emotionsResponse.data?.data || emotionsResponse.data || emotionsResponse;
        setEmotions(emotionsData);
        setEmotionsLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки эмоций:', error);
      }

      try {
        let allLogs = [];
        if (isAuthenticated()) {
          allLogs = await fetchAllPages('/emotion-logs?per_page=100');
        } else {
          allLogs = getOfflineLogs();
        }
        setLogs(allLogs);
        setLogsLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки логов:', error);
      }
    };
    fetchData();
  }, []);

  const emotionCounts = getEmotionCounts();
  const maxCount = getMaxCount(emotionCounts);
  const emotionColors = [
    'var(--happy-color)',
    'var(--fine-color)',
    'var(--normal-color)',
    'var(--sad-color)',
    'var(--angry-color)'
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pillsContainer}>
        {!logsLoaded && (
          <>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
          </>
        )}
        {logsLoaded &&
          emotions.map((emotion, idx) => {
            const count = emotionCounts[emotion.id] || 0;
            const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isMax = count === maxCount && maxCount > 0;

            return (
              <div
                key={emotion.id}
                className={styles.pillBar}
                style={{
                  height: `${percent}%`,
                  backgroundColor: isMax ? emotionColors[idx % emotionColors.length] : 'transparent',
                  border: !isMax ? `2px solid ${emotionColors[idx % emotionColors.length]}` : 'none'
                }}
                title={`${emotion.name}: ${count} записей`}
              />
            );
          })}
      </div>

      <div className={styles.emotionsContainer}>
        {!emotionsLoaded && (
          <>
            <span className={styles.loadCircle}></span>
            <span className={styles.loadCircle}></span>
            <span className={styles.loadCircle}></span>
            <span className={styles.loadCircle}></span>
            <span className={styles.loadCircle}></span>
          </>
        )}
        {emotionsLoaded &&
          emotions.map((item, index) => (
            <button
              key={index}
              className={styles.buttonContainer}
              onClick={() => createEmotionLog(item.id)}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/${item.media[0].file_path}`}
                alt={item.name}
              />
            </button>
          ))}
      </div>

      <Button className={styles.button} noBg={true} shadowType={null} onClick={goToLogsList}>
        <Icons.More />
      </Button>
    </div>
  );
};

export default EmotionChart;