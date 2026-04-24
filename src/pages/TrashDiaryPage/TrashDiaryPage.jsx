import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import Input from "../../components/common/Input/Input";
import Modal from "../../components/common/Modal/Modal";
import * as Icons from '../../assets/icons';
import client from "../../api/client";
import styles from './TrashDiaryPage.module.css';
import Skeleton from "../../components/common/Skeleton/Skeleton";

const TrashDiaryPage = () => {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLog, setActiveLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getTrash();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getTrash(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getTrash = async (search = '') => {
    try {
      setIsLoading(true);
      // Используем общий эндпоинт для всей корзины
      const url = `/all-diaries/trash?search=${search}`;
      const response = await client(url);
      // Учитываем структуру ответа (response.data.data)
      setDiaries(response.data.data);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEndpoint = (type) => {
    switch (type) {
      case 'feelings': return 'feelings-diaries';
      case 'personal': return 'personal-diaries';
      case 'food': return 'food-diaries';
      default: return 'feelings-diaries';
    }
  };

  const handleRestore = async (diary) => {
    try {
      await client(`/${getEndpoint(diary.type)}/${diary.id}/restore`, { method: 'POST' });
      setIsModalOpen(false);
      getTrash(searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForceDelete = async (diary) => {
    try {
      await client(`/${getEndpoint(diary.type)}/${diary.id}/force`, { method: 'DELETE' });
      setIsModalOpen(false);
      getTrash(searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const openOptions = (diary) => {
    setActiveLog(diary);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.list}>
      <Input
        className={styles.search}
        type="search"
        placeholder='Поиск в корзине...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading && [1, 2, 3].map((n) => <Skeleton key={n} />)}

      {!isLoading && diaries.length === 0 && (
        <div className={styles.noResults}>
          {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'Корзина пуста'}
        </div>
      )}

      {!isLoading && diaries.map((diary) => (
        <Container
          className={styles.container}
          key={`${diary.type}-${diary.id}`}
          buttonIcons={[Icons.More]}
          onClick={() => openOptions(diary)}
        >
          <div className={styles.diaryContent}>
            <div className={styles.textData}>
              <div className={styles.headerRow}>
                <h3>{diary.display_title || 'Без названия'}</h3>
                <span className={`${styles.typeBadge} ${styles[diary.type]}`}>
                  {diary.type === 'feelings' && 'Дневник чувств'}
                  {diary.type === 'personal' && 'Личный дневник'}
                  {diary.type === 'food' && 'Дневник питания'}
                </span>
              </div>
              <small>Удалено: {new Date(diary.deleted_at).toLocaleDateString()}</small>
            </div>
          </div>
        </Container>
      ))}

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            { 
              name: 'Восстановить', 
              onClick: () => handleRestore(activeLog) 
            },
            { 
              name: 'Удалить навсегда', 
              onClick: () => handleForceDelete(activeLog) 
            },
            { 
              name: 'Отмена', 
              onClick: () => setIsModalOpen(false) 
            },
          ]}
        >
          <div className={styles.modalHeader}>
            {activeLog?.display_title}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrashDiaryPage;
