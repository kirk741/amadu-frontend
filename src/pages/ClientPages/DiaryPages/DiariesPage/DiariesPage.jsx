import * as Icons from '../../../../assets/icons';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmptyCard from "../../../../components/ui/EmptyCard/EmptyCard";
import Modal from "../../../../components/ui/Modal/Modal";
import List from "../../../../components/ui/List/List";
import { useDiaries } from "../../../../hooks/useDiaries";
import styles from '../DiaryStyles.module.css';

const DiariesPage = () => {
  const navigate = useNavigate();
  const {
    diaries, pagination, isLoading, searchQuery,
    setSearchQuery, removeDiary, refresh, getImageUrl
  } = useDiaries();

  const [activeLog, setActiveLog] = useState(null);
  const [modal, setModal] = useState({ open: false, type: 'options' });

  const openOptions = (diary) => {
    setActiveLog(diary);
    setModal({ open: true, type: 'options' });
  };

  return (
    <List
      items={diaries}
      isLoading={isLoading}
      mapItem={(diary) => ({
        id: `${diary.type}-${diary.id}`,
        type: diary.type,
        imageUrl: getImageUrl(diary),
        title: diary.display_title || diary.name,
        description: diary.content || diary.conclusion || diary.thoughts,
        date: diary.created_at,
      })}
      onItemBtnClick={(diary) => openOptions(diary)}
      onItemClick={(diary) => navigate(`/diary/${diary.type}/edit/${diary.id}`)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isLoading={isLoading}
      isEmpty={diaries.length === 0}
      emptyComponent={<EmptyCard link={'/diary/create'} />}
      pagination={pagination}
      onPageChange={(page) => refresh(page)}
      actions={[
        { icon: <Icons.Trash />, onClick: () => navigate('/diary/trash') },
        { icon: <Icons.Plus />, onClick: () => navigate('/diary/create') }
      ]}
    >

      {modal.open && (
        <Modal
          onClose={() => setModal({ ...modal, open: false })}
          childrenData={
            modal.type === 'options' ? [
              { name: 'Открыть', onClick: () => navigate(`/diary/${activeLog.type}/edit/${activeLog.id}`) },
              { name: 'Удалить', preventClose: true, onClick: () => setModal({ ...modal, type: 'delete' }) },
            ] : [
              { name: 'Удалить навсегда', onClick: () => removeDiary(activeLog, true) },
              { name: 'В корзину', onClick: () => removeDiary(activeLog, false) },
              { name: 'Отмена', preventClose: true, onClick: () => setModal({ ...modal, type: 'options' }) }
            ]
          }
        >
          {modal.type === 'options' ? activeLog?.display_title : "Удалить запись?"}
        </Modal>
      )}
    </List>
  );
};

export default DiariesPage;