import { useEffect, useState } from 'react';
import styles from './Calendar.module.css';
import * as Icons from '../../../../assets/icons';
import { useUser } from '../../../../hooks/useUser';
import { useParams } from 'react-router-dom';
import Modal from '../../../../components/ui/Modal/Modal';
import { useBooking } from '../../../../hooks/useBooking';

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [modal, setModal] = useState({ open: false, step: 'time' });
  const { id } = useParams();
  const { slots, createAppointment, loadData } = useBooking(id);
  const [status, setStatus] = useState('');

  const monthName = new Date(currentYear, currentMonth).toLocaleString('ru', { month: 'long' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const isCurrentMonth = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

  const formatDate = (day) => {
    const month = String(currentMonth + 1).padStart(2, '0');
    const d = day.padStart(2, '0');
    return `${currentYear}-${month}-${d}`;
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (isCurrentMonth) return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.calendar}>
        <div className={styles.calendar__header}>
          <span>{monthName.toUpperCase()} {currentYear}</span>
          <div>
            <span
              className={`${styles.calendar__arrow} ${isCurrentMonth ? styles.calendar__arrow_unactive : ''}`}
              onClick={prevMonth}><Icons.ArrowBack /></span>
            <span className={styles.calendar__arrow} onClick={nextMonth}><Icons.ArrowForward /></span>
          </div>
        </div>

        <div className={styles.calendar__weekdays}>
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>

        <div className={styles.calendar__grid}>
          {
            Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.calendar__day_empty} />
            ))
          }
          {
            days.map((day) => {
              const formattedDate = formatDate(String(day));
              const daySlots = slots.filter(s => s.start_time.startsWith(formattedDate));
              const hasAvailable = daySlots.some(s => !s.is_booked);

              return (
                <span
                  key={day}
                  className={`${styles.calendar__day} ${hasAvailable ? styles.calendar__day_available : ''}`}
                  onClick={() => hasAvailable ? setSelectedDay(formattedDate) : ''}
                >
                  {day}
                </span>
              );
            })
          }
          {selectedDay && (
            <Modal
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
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar;