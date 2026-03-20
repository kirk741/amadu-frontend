import { useEffect, useState } from 'react';
import * as Icons from '../../../assets/icons';
import client from '../../../api/client.js';
import styles from './EmotionChart.module.css';
import Button from '../../../components/common/Button/Button.jsx';

const EmotionChart = () => {
  const [emotions, setEmotions] = useState([]);
  const [emotionsLoaded, setEmotionsLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoaded, setLogsLoaded] = useState(false);
  console.log("ТЕКУЩИЕ ЭМОЦИИ В СТЕЙТЕ:", emotions);

  const getEmotions = async () => {
    try {
      const data = await client('/emotions');
       console.log("ЧТО ПРИШЛО С СЕРВЕРА:", data);
      setEmotions(data);
      setEmotionsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  const getEmotionLogs = async () => {
    try {
      const data = await client('/emotion-logs');
      setLogs(data);
      setLogsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEmotions();
    getEmotionLogs();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pillsContainer}>
          {
            !logsLoaded &&
            <>
              <span className={styles.loadPill}></span>
              <span className={styles.loadPill}></span>
              <span className={styles.loadPill}></span>
              <span className={styles.loadPill}></span>
              <span className={styles.loadPill}></span>
            </>
          }
          {
            logsLoaded &&
            <>
              <span className={styles.pill} style={{ backgroundColor: 'var(--happy-color)' }}></span>
              <span className={styles.pill} style={{ backgroundColor: 'var(--fine-color)' }}></span>
              <span className={styles.pill} style={{ backgroundColor: 'var(--normal-color)' }}></span>
              <span className={styles.pill} style={{ backgroundColor: 'var(--sad-color)' }}></span>
              <span className={styles.pill} style={{ backgroundColor: 'var(--angry-color)' }}></span>
            </>
          }
        </div>
        <div className={styles.emotionsContainer}>
          {
            !emotionsLoaded &&
            <>
              <span className={styles.loadCircle}></span>
              <span className={styles.loadCircle}></span>
              <span className={styles.loadCircle}></span>
              <span className={styles.loadCircle}></span>
              <span className={styles.loadCircle}></span>
            </>
          }
          {
            emotionsLoaded &&
            emotions.data.map((item, index) => {
              console.log(item)
              return <button className={styles.buttonContainer}><img key={index} src={`/${item.media[0].file_path}`} alt={item.name} /></button>
})
          }
        </div>
        {<Button className={styles.button} noBg={true} shadowType={null}><Icons.More /></Button>}
      </div>
    </>
  )
}

export default EmotionChart;