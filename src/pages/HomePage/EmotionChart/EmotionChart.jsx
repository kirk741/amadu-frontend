import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../../assets/icons';
import client from '../../../api/client.js';
import styles from './EmotionChart.module.css';
import Button from '../../../components/common/Button/Button.jsx';
import Modal from '../../../components/common/Modal/Modal.jsx';
import { formatToDB } from '../../../utils/formatDate.js';

const emotionData = {
  'Happy': 'var(--happy-color)',
  'Fine': 'var(--fine-color)',
  'Ok': 'var(--normal-color)',
  'Sad': 'var(--sad-color)',
  'Angry': 'var(--angry-color)'
};

const EmotionChart = () => {
  const [emotions, setEmotions] = useState([]);
  const [emotionsLoaded, setEmotionsLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getEmotions = async () => {
    try {
      const emotions = await client('/emotions');
      setEmotions(emotions.data);
      setEmotionsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  const getEmotionLogs = async () => {
    try {
      let currentPage = 1;
      let lastPage = 1;
      let allLogs = [];
      let response = []

      while (lastPage >= currentPage) {
        response = await client(`/emotion-logs?page=${currentPage}`);
        allLogs = [...allLogs, ...response.data.data];
        lastPage = response.data.last_page;
        currentPage++;
      }
      setLogs(allLogs);
      setAllLogs(allLogs);
    } catch (error) {
      console.error(error);
    }
  }

  const renderEmotionStatistics = () => {
    const emotionsMap = emotions.reduce((acc, emo) => {
      acc[emo.id] = emo.name;
      return acc;
    }, {});
    
    const counts = logs.reduce((acc, log) => {
      const name = emotionsMap[log.emotion_id];
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(counts), 0);

    return Object.keys(emotionData).map((name, index) => {
      const count = counts[name] || 0;
      const height = maxCount > 0 ? (count / maxCount) * 100 : 5;
      const isMax = count === maxCount && count > 0;

      return <span
        key={index}
        className={styles.pill}
        style={{
          backgroundColor: isMax ? emotionData[name] : 'transparent',
          border: `2px solid ${emotionData[name]}`,
          height: `${Math.max(height)}%`
        }}
        data-testid="pill">
      </span>
    });
  }

  useEffect(() => {
    getEmotions();
    getEmotionLogs();
  }, []);

  const createEmotionLog = async (id) => {
    try {
      await client('/emotion-logs', {
        body: {
          emotion_id: id,
          created_at: formatToDB(new Date())
        }
      });
      await getEmotionLogs();
    } catch (error) {
      console.error(error);
    }
  }

  const filterData = (interval) => {
    if (!interval) {
      setLogs(allLogs);
      return;
    }

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - interval);

    const filtered = allLogs.filter((item) => {
      const logDate = new Date(item.created_at);
      return logDate >= startDate && logDate <= now;
    });

    setLogs(filtered);
  }

  return (
    <div className={styles.container} onClick={() => setIsModalOpen(true)}>
      <div className={styles.pillsContainer}>
        {
          renderEmotionStatistics()
        }
      </div>

      <div className={styles.emotionsContainer} data-testid="emotions-container">
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
              onClick={(e) => { e.stopPropagation(); createEmotionLog(item.id)}}
              data-testid={`emotion-${item.id}`}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/${item.media[0].file_path}`}
                alt={item.name}
              />
            </button>
          ))}
      </div>

      <Button className={styles.button} noBg={true} shadowType={null} onClick={() => setIsModalOpen(true)} data-testid="open-modal">
        <Icons.More />
      </Button>
      {
        isModalOpen && <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            { 'name': 'За последние 7 дней', 'onClick': () => filterData(7) },
            { 'name': 'За последние 30 дней', 'onClick': () => filterData(30) },
            { 'name': 'За всё время', 'onClick': () => filterData(null) },
            { 'name': 'Открыть все записи', 'onClick': () => navigate('/emotion-logs') },
          ]}></Modal>
      }
    </div>
  );
};

export default EmotionChart;