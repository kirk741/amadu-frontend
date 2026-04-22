import { useEffect, useState } from "react";
import client from '../../api/client';
import Container from '../../components/common/Container/Container';
import styles from './EmotionLogsPage.module.css';
import * as Icons from '../../assets/icons';
import Modal from "../../components/common/Modal/Modal";
import Input from '../../components/common/Input/Input';
import Button from "../../components/common/Button/Button";
import { formatToDB, formatToInput } from "../../utils/formatDate";
import EmptyCard from "../../components/common/EmptyCard/EmptyCard";

const emotionTranslations = {
  'Happy': 'Счастье',
  'Fine': 'Удовлетворённость',
  'Ok': 'Нейтральность',
  'Sad': 'Грусть',
  'Angry': 'Раздражение'
};

const EmotionLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [activeDate, setActiveDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getLogs = async () => {
    setIsLoading(true);
    try {
      const data = await client('/emotion-logs');
      setLogs(data.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getEmotions = async () => {
    const data = await client('/emotions');
    setEmotions(data.data);
  }

  const deleteLog = async (id) => {
    await client(`/emotion-logs/${id}`, { method: 'DELETE' });
    getLogs();
  }

  useEffect(() => {
    getLogs();
    getEmotions();
  }, []);

  const changeLog = async () => {
    const dateForDb = formatToDB(activeDate);

    const formData = new FormData();
    formData.append('emotion_id', activeEmotion);
    formData.append('created_at', dateForDb);
    formData.append('_method', 'PATCH');

    try {
      await client(`/emotion-logs/${selectedLog.id}`, { method: 'POST', body: formData });
      setIsChangeModalOpen(false);
      getLogs();
    } catch (error) {
      console.error(error);
    }
  }

  return (<div className={styles.container}>
    {
      isLoading && logs.length === 0 && (
        <>
          {[1, 2, 3].map((n) => (
            <Container key={n}>
              <div className={styles.logContainer}>
                <div className={styles.skeletonCircle}></div>
                <div className={styles.logDataContainer}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLineSmall}></div>
                </div>
              </div>
            </Container>
          ))}
        </>
      )
    }
    {
      logs.length === 0 && !isLoading && <EmptyCard link={'/'} />
    }
    {
      logs.map((log, index) => {
        return <Container key={log.id} buttonIcons={[Icons.More]} onClick={() => { setActiveEmotion(log.emotion?.id); setSelectedLog(log); setIsModalOpen(true) }}>
          <div className={styles.logContainer}>
            <img src={`${process.env.REACT_APP_API_URL}/${log.emotion.media[0].file_path}`} alt={log.emotion.name} />
            <div className={styles.logDataContainer}>
              <h3>{emotionTranslations[log.emotion.name]}</h3>
              <small>{new Date(log.created_at).toLocaleDateString()}</small>
            </div>
          </div>
        </Container>
      })
    }
    {
      isModalOpen &&
      <Modal
        onClose={() => setIsModalOpen(false)}
        childrenData={[
          { 'name': 'Изменить запись', 'onClick': () => { setIsChangeModalOpen(selectedLog); setActiveDate(formatToInput(selectedLog.created_at)) } },
          { 'name': 'Удалить запись', 'onClick': () => deleteLog(selectedLog.id) },
        ]}>
      </Modal>
    }
    {
      isChangeModalOpen &&
      <Modal
        onClose={() => setIsChangeModalOpen(false)}>
        <div className={styles.changeModalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.emotionContainer}>
            {
              emotions.map(emotion => {
                return <div key={emotion.id} onClick={() => setActiveEmotion(emotion.id)}>
                  <img src={`${process.env.REACT_APP_API_URL}/${emotion.media[0].file_path}`} alt={emotion.name} className={`${styles.emotionImg} ${emotion.id === activeEmotion ? styles.emotionActiveImg : ''}`} />
                </div>
              })
            }
          </div>
          <Input className={styles.input} type="datetime-local" value={activeDate || selectedLog.created_at} onChange={(e) => setActiveDate(e.target.value)} />
          <Button onClick={() => changeLog()}>Сохранить</Button>
        </div>
      </Modal>
    }
  </div>);
};

export default EmotionLogsPage;