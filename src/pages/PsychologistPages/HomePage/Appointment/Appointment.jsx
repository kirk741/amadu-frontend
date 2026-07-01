import styles from './Appointment.module.css';
import * as Icons from '../../../../assets/icons';
import Container from '../../../../components/ui/Container/Container';
import Card from '../../../../components/ui/List/Card/Card';
import Button from '../../../../components/ui/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useMyBookings } from '../../../../hooks/useMyBookings';
import { useGlobalSchedule } from '../../../../context/ScheduleContext';
import { useEffect, useState } from 'react';
import Modal from '../../../../components/ui/Modal/Modal';

const Appointment = () => {
  const navigate = useNavigate();
  const { upcoming, isLoading, cancelAppointment, refresh } = useMyBookings();
  const { loadSlots } = useGlobalSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  if (isLoading) {
    return (
      <Container className={styles.skeletonContainer}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonDescription}></div>
      </Container>
    );
  }

  const appointmentModalButtons = [];
  if (upcoming && !actionStatus) {
    if (!isDeleteMode) {
      if (upcoming.status !== 'cancelled') {
        appointmentModalButtons.push({
          name: 'Отменить запись',
          preventClose: true,
          onClick: () => setIsDeleteMode(true)
        });
      }
      appointmentModalButtons.push({
        name: 'Открыть чат',
        onClick: () => {
          navigate(`/chat/${upcoming.client_id}`);
          setIsModalOpen(false);
        }
      });
    } else {
      appointmentModalButtons.push({
        name: 'Подтвердить отмену',
        preventClose: true,
        onClick: async () => {
          try {
            await cancelAppointment(upcoming.id);
            setActionStatus('success_delete');
            await loadSlots();
            if (refresh) await refresh();
          } catch (e) {
            setActionStatus('error');
          }
        }
      });
      appointmentModalButtons.push({
        name: 'Назад',
        preventClose: true,
        onClick: () => setIsDeleteMode(false)
      });
    }
  } else if (actionStatus === 'success_delete' || actionStatus === 'error') {
    appointmentModalButtons.push({
      name: 'Отлично',
      onClick: () => {
        setIsModalOpen(false);
        setActionStatus('');
        setIsDeleteMode(false);
      }
    });
  }

  return (
    <>
      <Container
        buttonIcons={[Icons.More]}
        btnOnClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        onClick={() => setIsModalOpen(true)}
      >
        {upcoming ? (
          <div className={styles.upcomingInfo}>
            <div className={styles.header}>
              <span>
                Ближайшая сессия:{' '}
                <span className={styles.headerData}>
                  {new Date(upcoming.schedule.start_time).toLocaleDateString('ru', { day: 'numeric', month: 'long' })} в{' '}
                  {new Date(upcoming.schedule.start_time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
            <div className={styles.psychologist}>
              Клиент:{' '}
              {upcoming.client.name}
            </div>
          </div>
        ) : (
          <span className={styles.upcomingInfo}>
            У вас нет подтверждённых записей. <Link to="/applications">Просмотреть заявки</Link>
          </span>
        )}
      </Container>

      {isModalOpen && upcoming && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setActionStatus('');
            setIsDeleteMode(false);
          }}
          childrenData={appointmentModalButtons}
        >
          {actionStatus === 'success_delete' && <span>Запись успешно отменена</span>}
          {actionStatus === 'error' && <span style={{ color: 'var(--error-color)' }}>Произошла ошибка при обработке запроса.</span>}

          {actionStatus === '' && !isDeleteMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(() => {
                const clientData = upcoming?.client;
                const firstMedia = clientData?.media && clientData.media.length > 0 ? clientData.media[0] : null;
                const clientAvatar = firstMedia ? firstMedia.file_path : null;
                const avatarUrl = clientAvatar ? (clientAvatar.startsWith('http') ? clientAvatar : `${process.env.REACT_APP_API_URL}/storage/${clientAvatar}`) : null;

                return (
                  <Card
                    title={clientData?.name || 'Клиент'}
                    imageUrl={avatarUrl}
                    type="user"
                    buttonIcons={[Icons.Chats]}
                    onClick={() => {
                      navigate(`/chat/${upcoming.client_id}`);
                      setIsModalOpen(false);
                    }}
                    btnOnClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chat/${upcoming.client_id}`);
                      setIsModalOpen(false);
                    }}
                  />
                );
              })()}

              {(() => {
                const start = new Date(upcoming.schedule?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const end = new Date(upcoming.schedule?.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                  const matched = statusMap[upcoming.status] || { text: 'Ожидает подтверждения', color: '#f2994a' };
                  return <strong style={{ color: matched.color, fontWeight: '600' }}>{matched.text}</strong>;
                })()}
              </p>
            </div>
          )}

          {isDeleteMode && actionStatus === '' && (
            <span>Вы действительно хотите отменить ближайшую запись?</span>
          )}
        </Modal>
      )}
    </>
  );
};

export default Appointment;
