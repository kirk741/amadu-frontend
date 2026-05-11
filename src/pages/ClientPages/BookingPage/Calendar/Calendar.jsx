import { useState } from 'react';
import styles from './Calendar.module.css';
import * as Icons from '../../../../assets/icons';
import { useParams } from 'react-router-dom';
import { useBooking } from '../../../../hooks/useBooking';
import CalendarSkeleton from './CalendarSkeleton/CalendarSkeleton';
import CalendarModal from './CalendarModal/CalendarModal';
import { formatDate, getCalendarData } from './Calendar.utils';

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const { id } = useParams();
  const { slots, createAppointment, loadData, isLoading } = useBooking(id);
  const [status, setStatus] = useState('');
  const { monthName, days, offset } = getCalendarData(currentYear, currentMonth);

  const isCurrentMonth = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

  const changeMonth = (delta) => {
    if (delta === -1 && isCurrentMonth) return;

    const newDate = new Date(currentYear, currentMonth + delta, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };


  const getStatusContent = () => {
    if (isLoading) {
      return { marker: styles.waitingMarker, char: '~', text: 'Ищем доступное время' };
    }
    if (slots.length === 0) {
      return { marker: styles.emptyMarker, char: '!', text: 'Нет доступного времени' };
    }
    return { marker: styles.notEmptyMarker, char: '✓', text: 'Есть доступное время' };
  };

  const loadStatus = getStatusContent();

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusInfo}>
        <span className={loadStatus.marker}>{loadStatus.char}</span>
        <span> {loadStatus.text}</span>
      </div>

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <>
          <div className={styles.calendar}>
            <div className={styles.calendar__header}>
              <span>{monthName.toUpperCase()} {currentYear}</span>
              <div>
                <span
                  className={`${styles.calendar__arrow} ${isCurrentMonth ? styles.calendar__arrow_unactive : ''}`}
                  onClick={() => changeMonth(-1)}> <Icons.ArrowBack /></span>
                <span className={styles.calendar__arrow} onClick={() => changeMonth(1)}><Icons.ArrowForward /></span>
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
                  const formattedDate = formatDate(day, currentMonth, currentYear);
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
                <CalendarModal
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  status={status}
                  setStatus={setStatus}
                  slots={slots}
                  createAppointment={createAppointment}
                  loadData={loadData}
                />
              )}
            </div>
          </div>
        </>
      )
      }
    </div >
  );
}

export default Calendar;