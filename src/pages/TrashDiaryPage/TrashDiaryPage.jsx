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
      setDiaries([]);

      const url = search
        ? `/feelings-diaries/trash?search=${search}`
        : `/feelings-diaries/trash`;

      const response = await client(url);
      setDiaries(response.data.data);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await client(`/feelings-diaries/${id}/restore`, { method: 'POST' });
      setIsModalOpen(false);
      getTrash(searchQuery);
    } catch (error) {
      alert("Ошибка при восстановлении");
    }
  };

  const handleForceDelete = async (id) => {
    try {
      await client(`/feelings-diaries/${id}/force`, { method: 'DELETE' });
      setIsModalOpen(false);
      getTrash(searchQuery);
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className={styles.list}>
      <Input
        className={styles.search}
        type="search"
        placeholder='Поиск в корзине'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading && (
        <>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} n={n} />
          ))}
        </>
      )}

      {!isLoading && diaries.length === 0 && (
        <div className={styles.noResults}>
          {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'Корзина пуста'}
        </div>
      )}

      {!isLoading && diaries.map((diary) => (
        <Container
          className={styles.container}
          key={diary.id}
          buttonIcons={[Icons.More]}
          onClick={() => { setActiveLog(diary); setIsModalOpen(true); }}
        >
          <div>
            <h3>{diary.situation}</h3>
            <small>Удалено: {new Date(diary.deleted_at).toLocaleDateString()}</small>
          </div>
        </Container>
      ))}

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            { name: 'Восстановить', onClick: () => handleRestore(activeLog.id) },
            { name: 'Удалить навсегда', onClick: () => handleForceDelete(activeLog.id) },
            { name: 'Отмена', onClick: () => setIsModalOpen(false) },
          ]}
        >
          {activeLog?.situation}
        </Modal>
      )}
    </div>
  );
};

export default TrashDiaryPage;
