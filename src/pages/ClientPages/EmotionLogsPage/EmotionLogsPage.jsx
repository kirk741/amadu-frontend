import { useState } from "react";
import styles from './EmotionLogsPage.module.css';
import Modal from "../../../components/ui/Modal/Modal";
import Input from '../../../components/ui/Input/Input';
import Button from "../../../components/ui/Button/Button";
import { formatToDB, formatToInput } from "../../../utils/formatDate";
import EmptyCard from "../../../components/ui/EmptyCard/EmptyCard";
import { useEmotions } from "../../../hooks/useEmotions";
import List from "../../../components/ui/List/List";

const emotionTranslations = {
  'Happy': 'Счастье',
  'Fine': 'Удовлетворённость',
  'Ok': 'Нейтральность',
  'Sad': 'Грусть',
  'Angry': 'Раздражение'
};

const EmotionLogsPage = () => {
  const {
    logs, emotions, pagination, isLoading, refresh, removeLog, updateLog
  } = useEmotions();

  const [selectedLog, setSelectedLog] = useState(null);
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [activeDate, setActiveDate] = useState('');
  const [modal, setModal] = useState({ open: false, type: 'options' });

  const handleSave = async () => {
    await updateLog(selectedLog.id, activeEmotion, formatToDB(activeDate));
    setModal({ ...modal, open: false });
  };

  return (
    <List
      items={logs}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={(page) => refresh(page)}
      isEmpty={logs.length === 0}
      emptyComponent={<EmptyCard link={'/'} />}
      mapItem={(log) => ({
        id: log.id,
        title: emotionTranslations[log.emotion.name] || log.emotion.name,
        date: log.created_at,
        imageUrl: `${process.env.REACT_APP_API_URL}/${log.emotion.media[0]?.file_path}`,
      })}
      onItemBtnClick={(log) => {
        setSelectedLog(log);
        setModal({ open: true, type: 'options' });
      }}
      onItemClick={(log) => {
        setSelectedLog(log);
        setActiveEmotion(log.emotion?.id);
        setActiveDate(formatToInput(log.created_at));
        setModal({ open: true, type: 'edit' });
      }}
    >
      {modal.open && modal.type === 'options' && (
        <Modal
          onClose={() => setModal({ ...modal, open: false })}
          childrenData={[
            {
              name: 'Изменить',
              preventClose: true,
              onClick: () => {
                setActiveDate(formatToInput(selectedLog.created_at));
                setActiveEmotion(selectedLog.emotion?.id);
                setModal({ open: true, type: 'edit' });
              }
            },
            {
              name: 'Удалить',
              onClick: () => {
                removeLog(selectedLog.id);
                setModal({ ...modal, open: false });
              }
            },
          ]}
        >
        </Modal>
      )}

      {modal.open && modal.type === 'edit' && (
        <Modal onClose={() => setModal({ ...modal, open: false })}>
          <div className={styles.changeModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.emotionContainer}>
              {emotions.map(emotion => (
                <div key={emotion.id} onClick={() => setActiveEmotion(emotion.id)}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${emotion.media[0]?.file_path}`}
                    className={`${styles.emotionImg} ${emotion.id === activeEmotion ? styles.emotionActiveImg : ''}`}
                    alt={emotion.name}
                  />
                </div>
              ))}
            </div>
            <Input
              type="datetime-local"
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
            />
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </Modal>
      )}
    </List>
  );
};

export default EmotionLogsPage;