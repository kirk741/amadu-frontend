import Container from "../../components/common/Container/Container";
import Input from "../../components/common/Input/Input";
import styles from './DiariesPage.module.css';
import * as Icons from '../../assets/icons';
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useEffect, useState } from "react";
import EmptyCard from "../../components/common/EmptyCard/EmptyCard";
import Modal from "../../components/common/Modal/Modal";
import Skeleton from "../../components/common/Skeleton/Skeleton";

const DiariesPage = () => {
  const [diaries, setDiaries] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLog, setActiveLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('options');
  const navigate = useNavigate();

  useEffect(() => {
    getDiaries();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getDiaries(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getDiaries = async (page = 1, search = '') => {
    window.scrollTo(0, 0);
    try {
      setIsLoading(true);
      const url = `/all-diaries?page=${page}&search=${search}`;
      const data = await client(url);
      const result = data.data;

      setDiaries(result.data);
      setPagination({
        current: result.current_page,
        last: result.last_page
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (diary) => {
    if (diary.type === 'food' && diary.media && diary.media.length > 0) {
      const token = localStorage.getItem('token');
      return `${process.env.REACT_APP_API_URL}/food-diaries/${diary.id}/file?token=${token}`;
    }
    return null;
  };

  const getEndpoint = (type) => {
    switch (type) {
      case 'feelings': return 'feelings-diaries';
      case 'personal': return 'personal-diaries';
      case 'food': return 'food-diaries';
      default: return 'feelings-diaries';
    }
  };

  const handleSoftDelete = async (diary) => {
    try {
      await client(`/${getEndpoint(diary.type)}/${diary.id}`, { method: 'DELETE' });
      setIsModalOpen(false);
      getDiaries(pagination.current, searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForceDelete = async (diary) => {
    try {
      await client(`/${getEndpoint(diary.type)}/${diary.id}/force`, { method: 'DELETE' });
      setIsModalOpen(false);
      getDiaries(pagination.current, searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPagination = () => {
    if (pagination.last <= 1) return null;
    const { current, last } = pagination;
    const pages = [];

    if (current > 1) {
      pages.push(
        <Button key="prev" onClick={() => getDiaries(current - 1)}>
          <Icons.ArrowBack />
        </Button>
      );
    }

    pages.push(
      <span key={1} className={current === 1 ? styles.activePage : ''} onClick={() => getDiaries(1)}>1</span>
    );

    if (current > 3) pages.push(<span key="dots1" className={styles.dots}>...</span>);

    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
      if (i === 1 || i === last) continue;
      pages.push(
        <span key={i} className={current === i ? styles.activePage : ''} onClick={() => getDiaries(i)}>{i}</span>
      );
    }

    if (current < last - 2) pages.push(<span key="dots2" className={styles.dots}>...</span>);

    if (last > 1) {
      pages.push(
        <span key={last} className={current === last ? styles.activePage : ''} onClick={() => getDiaries(last)}>{last}</span>
      );
    }

    if (current < last) {
      pages.push(
        <Button key="next" onClick={() => getDiaries(current + 1)}>
          <Icons.ArrowForward />
        </Button>
      );
    }

    return <div className={styles.pagination}>{pages}</div>;
  };

  return (
    <div className={styles.list}>
      <Input
        className={styles.search}
        type="search"
        placeholder='Поиск по записям...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading && [1, 2, 3].map((n) => <Skeleton key={n} />)}

      {!isLoading && diaries.length === 0 && !searchQuery && (
        <EmptyCard link={'/diary/create'} />
      )}

      {!isLoading && diaries.length === 0 && searchQuery && (
        <div className={styles.noResults}>Ничего не найдено</div>
      )}

      {!isLoading && diaries.map((diary) => {
        const imageUrl = getImageUrl(diary);
        return (
          <Container
            key={`${diary.type}-${diary.id}`}
            buttonIcons={[Icons.More]}
            className={styles.container}
            onClick={() => { setActiveLog(diary); setModalType('options'); setIsModalOpen(true); }}
          >
            <div className={styles.avatarWrapper}>
              {imageUrl ? (
                <img src={imageUrl} alt="" className={styles.typeImage} />
              ) : (
                <div className={`${styles.typeIcon} ${styles[diary.type]}`}>
                  {diary.type === 'feelings' && <Icons.Heart />}
                  {diary.type === 'personal' && <Icons.Diary />}
                </div>
              )}
            </div>

            <div className={styles.textData}>
              <h3>{diary.display_title || 'Без названия'}</h3>
              <p>{diary.content || diary.conclusion || diary.thoughts || 'Нет описания'}</p>
              <small>{new Date(diary.created_at).toLocaleDateString()}</small>
            </div>
          </Container>
        );
      })}

      {!isLoading && diaries.length > 0 && renderPagination()}

      <div className={styles.floatContainer}>
        <Button className={styles.floatButton} onClick={() => navigate('/diary/trash')}>
          <Icons.Trash />
        </Button>
        <Button className={styles.floatButton} onClick={() => navigate('/diary/create')}>
          <Icons.Plus />
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={
            modalType === 'options'
              ? [
                { name: 'Изменить', onClick: () => navigate(`/diary/${activeLog.type}/edit/${activeLog.id}`) },
                { name: 'Удалить', preventClose: true, onClick: () => setModalType('delete') }
              ]
              : [
                { name: 'Удалить навсегда', onClick: () => handleForceDelete(activeLog) },
                { name: 'В корзину', onClick: () => handleSoftDelete(activeLog) },
                { name: 'Отмена', preventClose: true, onClick: () => setModalType('options') }
              ]
          }
        >
          {modalType === 'options' ? activeLog?.display_title : "Удалить запись?"}
        </Modal>
      )}
    </div>
  );
}

export default DiariesPage;
