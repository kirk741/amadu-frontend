import { useEffect, useState } from 'react';
import { useMyBookings } from '../../../hooks/useMyBookings';
import { useNavigate } from "react-router-dom";
import EmptyCard from '../../../components/ui/EmptyCard/EmptyCard';
import Modal from '../../../components/ui/Modal/Modal';
import List from '../../../components/ui/List/List';
import Select from '../../../components/ui/Select/Select';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { getAppointments, pagination, isLoading } = useMyBookings();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ open: false, type: 'options' });
  const [activeItem, setActiveItem] = useState(null);
  const [status, setStatus] = useState('');

  const statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Ожидают ответа', value: 'scheduled' },
    { label: 'Подтверждено', value: 'confirmed' },
    { label: 'Отменено', value: 'cancelled' },
  ];

  const loadPage = async (page, searchQuery, status) => {
    const result = await getAppointments(page, searchQuery, status);
    setData(result);
  };

  useEffect(() => {
    loadPage(1, searchQuery, status);
  }, [status]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPage(1, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const openOptions = (item) => {
    setActiveItem(item);
    setModal({ open: true, type: 'options' });
  };

  return (
    <List
      items={data}
      isLoading={isLoading}
      mapItem={(item) => ({
        id: item.id,
        type: 'user',
        title: `${new Date(item.schedule?.start_time).toLocaleString('ru', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        description: [
          <span key='card_item-1'>{item.psychologist?.name || 'Не найдено'}</span>,
          <br key='card_item-2' />,
          <span key='card_item-3'>{item.status === 'scheduled' ? 'Ожидает ответа' : item.status === 'cancelled' ? 'Отменено' : item.status === 'confirmed' ? 'Подтверждено' : 'Ошибка'}</span>,
        ]
      })}
      onItemBtnClick={(item) => openOptions(item)}
      onItemClick={(item) => navigate(`/appointment/${item.id}`)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isEmpty={data.length === 0}
      emptyComponent={
        <EmptyCard
          text="Нет заявок"
          link="/psychologists"
          linkText="Открыть список психологов"
        />
      }
      pagination={pagination}
      onPageChange={(page) => loadPage(page)}
      filters={
        <Select
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
      }
    >
      {modal.open && (
        <Modal
          onClose={() => setModal({ ...modal, open: false })}
          childrenData={
            modal.type === 'options' ? [
              { name: 'Открыть запись', onClick: () => navigate(`/appointment/${activeItem.id}`) },
              { name: 'Отменить запись', preventClose: true, onClick: () => setModal({ ...modal, type: 'delete' }) },
            ] : [
              { name: 'Подтвердить отмену', onClick: () => { /* логика удаления */ } },
              { name: 'Назад', preventClose: true, onClick: () => setModal({ ...modal, type: 'options' }) }
            ]
          }
        >
          {modal.type === 'options' ? "" : "Вы действительно хотите отменить запись?"}
        </Modal>
      )}
    </List>
  );
}

export default AppointmentsPage;
