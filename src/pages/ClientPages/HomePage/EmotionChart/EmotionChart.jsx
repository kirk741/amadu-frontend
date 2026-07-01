import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../../../../assets/icons';
import client from '../../../../api/client.js';
import styles from './EmotionChart.module.css';
import Button from '../../../../components/ui/Button/Button.jsx';
import Modal from '../../../../components/ui/Modal/Modal.jsx';
import { formatToDB } from '../../../../utils/formatDate.js';
import { useEmotionChart } from '../../../../hooks/useEmotionChart.js';

const emotionColors = {
  'Happy': 'var(--happy-color)',
  'Fine': 'var(--fine-color)',
  'Ok': 'var(--normal-color)',
  'Sad': 'var(--sad-color)',
  'Angry': 'var(--angry-color)'
};

const EmotionChart = () => {
  const { emotions, logs, isLoading, addLog, filterLogs } = useEmotionChart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const renderPills = () => {
    const counts = logs.reduce((acc, log) => {
      const name = emotions.find(e => e.id === log.emotion_id)?.name;
      if (name) acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(counts), 0);

    return Object.keys(emotionColors).map((name, index) => {
      const count = counts[name] || 0;
      const height = maxCount > 0 ? (count / maxCount) * 100 : 5;
      const isMax = count === maxCount && count > 0;

      const targetEmotion = emotions.find(e => e.name === name);

      return (
        <span
          key={index}
          className={styles.pill}
          style={{
            backgroundColor: isMax ? emotionColors[name] : 'transparent',
            border: `2px solid ${emotionColors[name]}`,
            height: `${height}%`,
            cursor: targetEmotion ? 'pointer' : 'default' 
          }}
          onClick={(e) => {
            e.stopPropagation();

            if (targetEmotion?.id) {
              addLog(targetEmotion.id);
            }
          }}
        />
      );
    });
  };

  return (
    <div className={styles.container} onClick={() => setIsModalOpen(true)}>
      <div className={styles.pillsContainer}>{renderPills()}</div>

      <div className={styles.emotionsContainer}>
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => <span key={i} className={styles.loadCircle} />)
        ) : (
          emotions.map(item => (
            <button key={item.id} className={styles.buttonContainer} onClick={(e) => {
              e.stopPropagation();
              addLog(item.id);
            }}>
              <img src={`${process.env.REACT_APP_API_URL}/${item.media[0].file_path}`} alt="" height='48' width='48' />
            </button>
          ))
        )}
      </div>

      <Button className={styles.button} noBg shadowType={null} onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
        <Icons.More />
      </Button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} childrenData={[
          { name: 'За 7 дней', onClick: () => filterLogs(7) },
          { name: 'За 30 дней', onClick: () => filterLogs(30) },
          { name: 'За всё время', onClick: () => filterLogs(null) },
          { name: 'Все записи', onClick: () => navigate('/emotion-logs') },
        ]} />
      )}
    </div>
  );
};

export default EmotionChart;
