import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../../../hooks/useMyBookings';
import EmptyCard from '../../../components/ui/EmptyCard/EmptyCard';
import Modal from '../../../components/ui/Modal/Modal';
import List from '../../../components/ui/List/List';
import Select from '../../../components/ui/Select/Select';
import Card from '../../../components/ui/List/Card/Card';
import * as Icons from '../../../assets/icons';
import { useGlobalSchedule } from '../../../context/ScheduleContext';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { getAppointments, pagination, isLoading, cancelAppointment, confirmAppointment } = useMyBookings();
  const { loadSlots } = useGlobalSchedule();
  
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ open: false, type: 'options' });
  const [activeItem, setActiveItem] = useState(null);
  
  const [status, setStatus] = useState('scheduled'); 
  const [actionStatus, setActionStatus] = useState('');

  const statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Ожидают ответа', value: 'scheduled' },
    { label: 'Подтверждено', value: 'confirmed' },
    { label: 'Отменено', value: 'cancelled' },
  ];

  const loadPage = async (page, query, stat) => {
    const cleanPage = typeof page === 'string' ? page.replace(/\D/g, '') : page;
    const pageNumber = Number(cleanPage) || 1;
    const result = await getAppointments(pageNumber, query, stat);
    setData(result || []);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPage(1, searchQuery, status);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, status]);

  const mapBookingToCard = (item) => {
    const clientData = item?.client;
    const firstMedia = clientData?.media && clientData.media.length > 0 ? clientData.media[0] : null;
    const clientAvatar = firstMedia ? firstMedia.file_path : null;
    
    const statusMap = {
      'scheduled': 'Ожидает ответа',
      'confirmed': 'Подтверждено',
      'completed': 'Завершено',
      'cancelled': 'Отменено'
    };

    let avatarUrl = null;
    if (clientAvatar) {
      avatarUrl = clientAvatar.startsWith('http')
        ? clientAvatar
        : `${process.env.REACT_APP_API_URL}/storage/${clientAvatar}`;
    }

    const currentStatus = item.status || item.appointment?.status || 'scheduled';

    return {
      id: item.id,
      type: 'user',
      imageUrl: avatarUrl,
      buttonIcons: [Icons.Chats],
      title: `${new Date(item.schedule?.start_time).toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      
      client_id: item.client_id || clientData?.id, 
      
      description: [
        <span key="card_item-1">{clientData?.name || 'Не найдено'}</span>,
        <br key="card_item-2" />,
        <span key="card_item-3">{statusMap[currentStatus] || 'Ожидает ответа'}</span>,
      ]
    };
  };

  const openOptions = (item) => {
    setActiveItem(item);
    setModal({ open: true, type: 'options' });
  };

  const appointmentModalButtons = [];
  if (activeItem) {
    const currentStatus = activeItem.status || activeItem.appointment?.status || 'scheduled';
    const cleanStatus = String(currentStatus).trim().toLowerCase();

    if (cleanStatus === 'scheduled') {
      appointmentModalButtons.push({
        name: 'Подтвердить запись',
        preventClose: true,
        onClick: async () => {
          try {
            await confirmAppointment(activeItem.id);
            setActionStatus('success_confirm');
            await loadSlots();
            await loadPage(1, searchQuery, status);
          } catch (e) {
            setActionStatus('error');
          }
        }
      });
    }

    if (cleanStatus !== 'cancelled') {
      appointmentModalButtons.push({
        name: 'Отменить запись',
        preventClose: true,
        onClick: () => setModal({ ...modal, type: 'delete' })
      });
    }
  }

  return (
    <List
      items={data}
      isLoading={isLoading}
      mapItem={mapBookingToCard}
      
      onItemBtnClick={(card) => navigate(`/chat/${card.client_id}`)}
      onItemClick={(item) => openOptions(item)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isEmpty={data.length === 0}
      emptyComponent={
        <EmptyCard
          text="Нет заявок, отвечающих запросу"
          link="#"
          linkText=""
        />
      }
      pagination={pagination}
      onPageChange={(page) => loadPage(page, searchQuery, status)}
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
          onClose={() => {
            setModal({ ...modal, open: false });
            setActionStatus('');
          }}
          childrenData={
            actionStatus === 'success_delete' || actionStatus === 'success_confirm'
              ? [{ name: 'Отлично', onClick: () => { setModal({ ...modal, open: false }); setActionStatus(''); } }]
              : actionStatus === 'error'
              ? [{ name: 'Назад', onClick: () => setActionStatus('') }]
              : modal.type === 'options'
              ? appointmentModalButtons
              : [
                  {
                    name: 'Подтвердить отмену',
                    preventClose: true,
                    onClick: async () => {
                      try {
                        await cancelAppointment(activeItem.id);
                        setActionStatus('success_delete');
                        await loadSlots();
                        await loadPage(1, searchQuery, status);
                      } catch (e) {
                        setActionStatus('error');
                      }
                    }
                  },
                  { name: 'Назад', preventClose: true, onClick: () => setModal({ ...modal, type: 'options' }) }
                ]
          }
        >
          {actionStatus === 'success_delete' && <span>Запись успешно отменена</span>}
          {actionStatus === 'success_confirm' && <span>Запись успешно подтверждена</span>}
          {actionStatus === 'error' && <span style={{ color: 'var(--error-color)' }}>Произошла ошибка при обработке запроса.</span>}
          {actionStatus === '' && (
            modal.type === 'options' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(() => {
                  const clientData = activeItem?.client;
                  const firstMedia = clientData?.media && clientData.media.length > 0 ? clientData.media[0] : null;
                  const clientAvatar = firstMedia ? firstMedia.file_path : null;
                  const avatarUrl = clientAvatar ? (clientAvatar.startsWith('http') ? clientAvatar : `${process.env.REACT_APP_API_URL}/storage/${clientAvatar}`) : null;

                  return (
                    <Card
                      title={clientData?.name || 'Тест Тестов'}
                      imageUrl={avatarUrl}
                      type="user"
                      buttonIcons={[Icons.Chats]}
                      onClick={() => {
                        navigate(`/chat/${activeItem.client_id}`);
                        setModal({ ...modal, open: false });
                      }}
                      btnOnClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat/${activeItem.client_id}`);
                        setModal({ ...modal, open: false });
                      }}
                    />
                  );
                })()}
                {(() => {
                  const start = new Date(activeItem?.schedule?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const end = new Date(activeItem?.schedule?.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-color)' }}>
                      Время приёма: <strong>{start} - {end}</strong>
                    </p>
                  );
                })()}
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-color)' }}>
                  Статус:{' '}
                  {(() => {
                    const statusMap = {
                      'scheduled': { text: 'Ожидает подтверждения', color: '#f2994a' },
                      'confirmed': { text: 'Подтверждено', color: '#27ae60' },
                      'completed': { text: 'Завершено', color: 'var(--unactive-color)' },
                      'cancelled': { text: 'Отменено', color: '#eb5757' }
                    };
                    const currentStatus = activeItem?.status || activeItem?.appointment?.status || 'scheduled';
                    const matched = statusMap[String(currentStatus).trim().toLowerCase()] || { text: 'Ожидает подтверждения', color: '#f2994a' };
                    return <strong style={{ color: matched.color, fontWeight: '600' }}>{matched.text}</strong>;
                  })()}
                </p>
              </div>
            ) : "Вы действительно хотите отменить запись?"
          )}
        </Modal>
      )}
    </List>
  );
};

export default AppointmentsPage;
