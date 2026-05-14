import Modal from "../../Modal/Modal";
import styles from './CalendarModal.module.css';

const CalendarModal = ({
  selectedDay,
  setSelectedDay,
  selectedSlot,
  setSelectedSlot,
  status,
  setStatus,
  slots,
  createAppointment,
  loadData
}) => {
  return <Modal
    onClose={() => {
      setSelectedDay('');
      setSelectedSlot('');
      setStatus('');
    }}
    childrenData={
      status !== ''
        ? [
          {
            name: 'Отлично',
            onClick: () => {
              setSelectedDay('');
              setSelectedSlot('');
              setStatus('');
            }
          }
        ]
        : !selectedSlot
          ? []
          : [
            {
              name: 'Подтвердить запись',
              preventClose: true,
              onClick: async () => {
                try {
                  await createAppointment(selectedSlot);
                  setSelectedSlot('');
                  setStatus(true);
                  loadData();
                } catch (e) {
                  setStatus(false);
                  loadData();
                }
              }
            },
            {
              name: 'Назад',
              preventClose: true,
              onClick: () => setSelectedSlot('')
            }
          ]
    }
  >
    {status === true && (
      <div className={styles.statusSuccess}>
        <span>Запись успешно создана. Ожидайте подтверждения от психолога</span>
      </div>
    )}

    {status === false && (
      <div className={styles.statusError}>
        <span>Ошибка при записи. Попробуйте еще раз</span>
      </div>
    )}

    {status === '' && (
      <>
        {!selectedSlot ? (
          <>
            <span>Доступное время на {new Date(selectedDay + 'T00:00:00').toLocaleDateString('ru', {
              day: 'numeric',
              month: 'long'
            })}</span>
            <div className={styles.timeGrid}>
              {slots
                .filter((d) => d.start_time.startsWith(selectedDay) && !d.is_booked)
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((slot) => (
                  <span
                    key={slot.id}
                    className={styles.timeSlot}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    {new Date(slot.start_time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ))}
            </div>
          </>
        ) : (
          <div className={styles.confirmText}>
            <span>Создать запись на {new Date(selectedDay + 'T00:00:00').toLocaleDateString('ru', {
              day: 'numeric',
              month: 'long'
            })}</span> в {new Date(slots.find(s => s.id === selectedSlot)?.start_time).toLocaleTimeString('ru', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </>
    )}
  </Modal>
}

export default CalendarModal;