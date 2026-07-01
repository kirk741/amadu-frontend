import styles from './Calendar.module.css';
import * as Icons from '../../../assets/icons';
import CalendarSkeleton from './CalendarSkeleton/CalendarSkeleton';
import { getCalendarData } from './Calendar.utils';
import { useState } from 'react';

const Calendar = ({
  slots = [],
  bookings = [],
  isLoading,
  onDayClick,
  renderStatus,
  isPsychologist = false
}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const { monthName, days, offset } = getCalendarData(currentYear, currentMonth);
  const isCurrentMonth = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

  const changeMonth = (delta) => {
    if (delta === -1 && isCurrentMonth) return;
    const newDate = new Date(currentYear, currentMonth + delta, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusInfo}>
        {renderStatus ? renderStatus() : null}
      </div>

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <div className={styles.calendar}>
          <div className={styles.calendar__header}>
            <span>{monthName.toUpperCase()} {currentYear}</span>
            <div>
              <span
                className={`${styles.calendar__arrow} ${isCurrentMonth ? styles.calendar__arrow_unactive : ''}`}
                onClick={() => changeMonth(-1)}
              >
                <Icons.ArrowBack />
              </span>
              <span className={styles.calendar__arrow} onClick={() => changeMonth(1)}>
                <Icons.ArrowForward />
              </span>
            </div>
          </div>

          <div className={styles.calendar__weekdays}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className={styles.calendar__grid}>
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.calendar__day_empty} />
            ))}
            {days.map((day) => {
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              const today = new Date();
              const currentCellDate = new Date(currentYear, currentMonth, day);
              const isPast = currentCellDate < new Date().setHours(0, 0, 0, 0);

              const allDaySlots = slots.filter(s => s.start_time.startsWith(dateStr));

              const daySlots = allDaySlots.filter(s => {
                const slotStartTime = new Date(s.start_time);
                return slotStartTime >= today;
              });

              const hasSlots = isPsychologist ? daySlots.length > 0 : daySlots.some(s => !s.is_booked);

              const hasBooked = allDaySlots.some(s => s.is_booked);

              const dayBookings = bookings.filter(b => daySlots.some(s => s.id === b.schedule_id));

              const hasPending = isPsychologist && dayBookings.some(b => b.status === 'scheduled');
              const hasConfirmed = isPsychologist && dayBookings.some(b => b.status === 'confirmed');

              const isDayEmpty = daySlots.length === 0;

              const dayClass = `${styles.calendar__day} ` +
                `${isPast || (currentCellDate.toDateString() === today.toDateString() && isDayEmpty) ? styles.calendar__day_past : ''} ` +
                `${hasSlots && !isPast ? styles.calendar__day_available : ''} ` +
                `${isPsychologist && hasBooked ? styles.calendar__day_hasBooked : ''}`;

              return (
                <span
                  key={day}
                  className={dayClass}
                  onClick={() => {
                    if (isPast) return;
                    if (isPsychologist || hasSlots) {
                      onDayClick(dateStr);
                    }
                  }}
                >
                  {day}
                  {hasPending ? (
                    <span className={`${styles.statusDot} ${styles.statusDot_pending}`} />
                  ) : hasConfirmed ? (
                    <span className={`${styles.statusDot} ${styles.statusDot_confirmed}`} />
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
