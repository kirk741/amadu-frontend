import { useState } from "react";
import { useTrash } from "../../../../hooks/useTrash";
import List from "../../../../components/ui/List/List";
import Modal from "../../../../components/ui/Modal/Modal";
import EmptyCard from "../../../../components/ui/EmptyCard/EmptyCard";

const TrashDiaryPage = () => {
  const {
    diaries, pagination, isLoading, searchQuery,
    setSearchQuery, restoreDiary, forceDelete, refresh
  } = useTrash();

  const [activeLog, setActiveLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openOptions = (diary) => {
    setActiveLog(diary);
    setIsModalOpen(true);
  };

  return (
    <List
      items={diaries}
      isLoading={isLoading}
      isEmpty={diaries.length === 0}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      pagination={pagination}
      onPageChange={refresh}
      emptyComponent={
        <EmptyCard
          text="Корзина пуста"
          link="/diary"
          linkText="Перейти к дневникам"
        />
      }
      mapItem={(diary) => ({
        id: `${diary.type}-${diary.id}`,
        type: diary.type,
        title: diary.display_title || 'Без названия',
        description: `Удалено: ${new Date(diary.deleted_at).toLocaleDateString()}`,
        content: diary.type === 'feelings' ? 'Дневник чувств' :
          diary.type === 'personal' ? 'Личный дневник' : 'Дневник питания'
      })}
      onItemBtnClick={openOptions}
      onItemClick={openOptions}
    >
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            {
              name: 'Восстановить',
              onClick: () => { restoreDiary(activeLog); setIsModalOpen(false); }
            },
            {
              name: 'Удалить навсегда',
              onClick: () => { forceDelete(activeLog); setIsModalOpen(false); }
            },
            { name: 'Отмена', onClick: () => setIsModalOpen(false) },
          ]}
        >
          {activeLog?.display_title || 'Удаленная запись'}
        </Modal>
      )}
    </List>
  );
};

export default TrashDiaryPage;