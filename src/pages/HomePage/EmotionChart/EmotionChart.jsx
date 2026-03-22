import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../../assets/icons';
import client from '../../../api/client.js';
import styles from './EmotionChart.module.css';
import Button from '../../../components/common/Button/Button.jsx';
import { getOfflineLogs, saveOfflineLog } from '../../../utils/offlineStorage';

const EmotionChart = () => {
  const [emotions, setEmotions] = useState([]);
  const [emotionsLoaded, setEmotionsLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoaded, setLogsLoaded] = useState(false);

  const getEmotions = async () => {
    try {
      const emotions = await client('/emotions');
      setEmotions(emotions);
      setEmotionsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEmotions();
  }, []);

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

        {logsLoaded && (
          <>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
            <span className={styles.loadPill}></span>
          </>
        )}
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