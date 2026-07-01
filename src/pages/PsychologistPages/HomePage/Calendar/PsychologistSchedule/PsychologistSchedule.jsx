import { useState } from 'react';
import Calendar from '../../../../../components/ui/Calendar/Calendar';
import List from '../../../../../components/ui/List/List';
import Modal from '../../../../../components/ui/Modal/Modal';
import Button from '../../../../../components/ui/Button/Button';
import SlotGeneratorForm from '../SlotGeneratorForm/SlotGeneratorForm';
import * as Icons from '../../../../../assets/icons';
import CardAvatar from '../../../../../components/ui/List/Card/CardAvatar/CardAvatar';
import Card from '../../../../../components/ui/List/Card/Card';
import { useGlobalSchedule } from '../../../../../context/ScheduleContext';
import { useNavigate } from 'react-router-dom';

const PsychologistSchedule = ({
  slots = [],
  bookings = [],
  isLoading,
  onGenerateSlots,
  onDeleteSlot,
  onCancelAppointment,
  onUpdateSlotStatus,
  onUpdateSlotTime
}) => {
  const { loadSlots } = useGlobalSchedule();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const [activeAppointment, setActiveAppointment] = useState(null);
  const [activeEmptySlot, setActiveEmptySlot] = useState(null);
  const [isEditingSlot, setIsEditingSlot] = useState(false);

  const [confirmCancel, setConfirmCancel] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  const now = new Date();

  const daySlots = slots.filter(slot => {
    const isSameDay = slot.start_time.startsWith(selectedDate);
    const isFutureSlot = new Date(slot.end_time) > now;

    return isSameDay && isFutureSlot;
  });
  const mapSlotToCard = (slot) => {
    const startTime = new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const matchingBooking = bookings.find(b => b.schedule_id === slot.id);
    const clientData = matchingBooking?.client;

    const firstMedia = clientData?.media && clientData.media.length > 0 ? clientData.media[0] : null;
    const clientAvatar = firstMedia ? firstMedia.file_path : null;

    const statusMap = {
      'scheduled': 'Ожидает подтверждения',
      'confirmed': 'Подтверждено',
      'completed': 'Завершено',
      'cancelled': 'Отменено'
    };

    const appointmentStatus = slot.is_booked ? (matchingBooking?.status || 'scheduled') : 'free';
    const statusText = slot.is_booked ? `${statusMap[appointmentStatus] || 'Ожидает подтверждения'}` : 'Свободное время';

    let avatarUrl = null;
    if (clientAvatar) {
      avatarUrl = clientAvatar.startsWith('http')
        ? clientAvatar
        : `${process.env.REACT_APP_API_URL}/storage/${clientAvatar}`;
    }

    return {
      id: slot.id,
      title: slot.is_booked ? `${startTime} - ${endTime} – ${clientData?.name || 'Клиент'}` : `${startTime} - ${endTime}`,
      description: statusText,
      status: appointmentStatus,
      imageUrl: slot.is_booked ? avatarUrl : null,
      type: slot.is_booked ? 'user' : null,
      btnText: slot.is_booked ? 'Просмотреть' : 'Удалить слот',
    };
  };

  const handleItemClick = (slot) => {
    if (slot.is_booked) {
      const booking = bookings.find(b => b.schedule_id === slot.id);
      setActiveAppointment({ ...booking, slot_info: slot });
    } else {
      setActiveEmptySlot(slot);
    }
  };

  const handleSlotBtnClick = (slot) => {
    handleItemClick(slot);
  };

  const listActions = [{ icon: <Icons.Plus />, label: 'Добавить слоты', onClick: () => setIsGeneratorOpen(true) }];

  const appointmentModalButtons = [];
  if (activeAppointment && activeAppointment.status === 'scheduled') {
    appointmentModalButtons.push({
      name: 'Подтвердить запись',
      onClick: async () => {
        if (onUpdateSlotStatus) {
          await onUpdateSlotStatus(activeAppointment.id, 'confirmed');
          await loadSlots();
        }
        setActiveAppointment(null);
      }
    });
  }
  if (activeAppointment && activeAppointment.status !== 'cancelled') {
    appointmentModalButtons.push({
      name: 'Отменить запись',
      onClick: () => {
        setConfirmCancel(activeAppointment.id);
        setActiveAppointment(null);
      },
      preventClose: true
    });
  }

  const slotModalButtons = [
    {
      name: 'Изменить время',
      onClick: () => {
        setIsEditingSlot(true);
      },
      preventClose: true
    },
    {
      name: 'Удалить слот',
      onClick: () => {
        if (activeEmptySlot) {
          setConfirmDelete(activeEmptySlot.id);
          setActiveEmptySlot(null);
        }
      },
      preventClose: true
    }
  ];

  return (
    <div>
      <Calendar bookings={bookings} slots={slots} isLoading={isLoading} isPsychologist={true} onDayClick={(date) => setSelectedDate(date)} />

      {selectedDate && (
        <Modal onClose={() => setSelectedDate(null)} title={`Записи на ${selectedDate}`}>
          <List
            items={daySlots}
            isLoading={isLoading}
            mapItem={mapSlotToCard}
            onItemBtnClick={handleSlotBtnClick}
            onItemClick={handleItemClick}
            isEmpty={daySlots.length === 0}
            emptyComponent={<div>В этот день у вас нет слотов</div>}
            actions={listActions}
          />
        </Modal>
      )}

      {activeAppointment && (
        <Modal
          onClose={() => setActiveAppointment(null)}
          childrenData={activeAppointment.status !== 'cancelled' ? appointmentModalButtons : []}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {(() => {
              const firstMedia = activeAppointment.client?.media && activeAppointment.client.media.length > 0
                ? activeAppointment.client.media[0]
                : null;
              const clientAvatar = firstMedia ? firstMedia.file_path : null;
              const avatarUrl = clientAvatar
                ? (clientAvatar.startsWith('http') ? clientAvatar : `${process.env.REACT_APP_API_URL}/storage/${clientAvatar}`)
                : null;

              return (
                <Card
                  title={activeAppointment.client?.name || 'Клиент'}
                  imageUrl={avatarUrl}
                  type="user"
                  description="Перейти в чат"
                  buttonIcons={[Icons.Chats]}
                  onClick={() => {
                    if (activeAppointment.client_id) {
                      navigate(`/chat/${activeAppointment.client_id}`);
                    }
                  }}
                  btnOnClick={(e) => {
                    e.stopPropagation();
                    if (activeAppointment.client_id) {
                      navigate(`/chat/${activeAppointment.client_id}`);
                    }
                  }}
                />
              );

            })()}

            {(() => {
              const start = new Date(activeAppointment.slot_info?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const end = new Date(activeAppointment.slot_info?.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return <p style={{ margin: 0, fontSize: '15px' }}>Время приёма: <strong>{start} - {end}</strong></p>;
            })()}

            <p style={{ margin: 0, fontSize: '15px' }}>
              Статус:{' '}
              {(() => {
                const statusMap = {
                  'scheduled': { text: 'Ожидает подтверждения', color: '#f2994a' },
                  'confirmed': { text: 'Подтверждено', color: '#27ae60' },
                  'completed': { text: 'Завершено', color: 'var(--unactive-color)' },
                  'cancelled': { text: 'Отменено', color: '#eb5757' }
                };
                const currentStatus = statusMap[activeAppointment.status] || { text: 'Ожидает подтверждения', color: '#f2994a' };
                return <strong style={{ color: currentStatus.color }}>{currentStatus.text}</strong>;
              })()}
            </p>

          </div>
        </Modal>
      )}


      {activeEmptySlot && !isEditingSlot && (
        <Modal onClose={() => setActiveEmptySlot(null)} childrenData={slotModalButtons}>
          <div>
            <h3>Управление временным слотом</h3>
            <p>Текущее время: <strong>{new Date(activeEmptySlot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
          </div>
        </Modal>
      )}

      {isEditingSlot && activeEmptySlot && (
        <Modal onClose={() => { setIsEditingSlot(false); setActiveEmptySlot(null); }}>
          <SlotGeneratorForm
            initialDate={selectedDate}
            editSlot={activeEmptySlot}
            onSave={async (formData) => {
              if (onUpdateSlotTime) {
                await onUpdateSlotTime(activeEmptySlot.id, formData);
              }
              setIsEditingSlot(false);
              setActiveEmptySlot(null);
            }}
          />
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          onClose={() => setConfirmDelete(null)}
          childrenData={[
            {
              name: 'Да, удалить окошко',
              onClick: async () => {
                await onDeleteSlot(confirmDelete);
                setConfirmDelete(null);
              }
            },
            { name: 'Отмена', onClick: () => setConfirmDelete(null) }
          ]}
        >
          <div>
            <h3>Удалить этот слот?</h3>
            <p>Это действие физически удалит время из расписания.</p>
          </div>
        </Modal>
      )}

      {confirmCancel && (
        <Modal
          onClose={() => setConfirmCancel(null)}
          childrenData={[
            {
              name: 'Да, отменить приём',
              onClick: async () => {
                if (onCancelAppointment) {
                  await onCancelAppointment(confirmCancel);
                  await loadSlots();
                }
                setConfirmCancel(null);
              }
            },
            { name: 'Назад', onClick: () => setConfirmCancel(null) }
          ]}
        >
          <div>
            <h3>Отменить запись клиента?</h3>
            <p>Слот расписания автоматически освободится для бронирования другими пользователями.</p>
          </div>
        </Modal>
      )}

      {isGeneratorOpen && (
        <Modal onClose={() => setIsGeneratorOpen(false)}>
          <SlotGeneratorForm
            initialDate={selectedDate}
            onSave={async (formData) => {
              await onGenerateSlots(formData);
              setIsGeneratorOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default PsychologistSchedule;
