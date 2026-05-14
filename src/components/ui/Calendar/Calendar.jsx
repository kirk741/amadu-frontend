import styles from './Calendar.module.css';
import * as Icons from '../../../assets/icons';
import CalendarSkeleton from './CalendarSkeleton/CalendarSkeleton';
import { getCalendarData } from './Calendar.utils';
import { useState } from 'react';

const Calendar = ({
  slots = [],
  isLoading,
  onDayClick,
  renderStatus
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
              > <Icons.ArrowBack /> </span>
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
              const hasAvailable = slots.some(s => s.start_time.startsWith(dateStr) && !s.is_booked);

              return (
                <span
                  key={day}
                  className={`${styles.calendar__day} ${hasAvailable ? styles.calendar__day_available : ''}`}
                  onClick={() => hasAvailable && onDayClick(dateStr)}
                >
                  {day}
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