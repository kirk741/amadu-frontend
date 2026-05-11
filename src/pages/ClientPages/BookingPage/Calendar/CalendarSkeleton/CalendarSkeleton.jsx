import styles from './CalendarSkeleton.module.css';

const CalendarSkeleton = () => {
  return (
    <div className={styles.calendarSkeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonLine} style={{ width: '150px' }}></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className={styles.skeletonCircle} style={{ width: '32px', height: '32px' }}></div>
          <div className={styles.skeletonCircle} style={{ width: '32px', height: '32px' }}></div>
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

      <div className={styles.skeletonGrid}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`sw-${i}`} className={styles.skeletonLineSmall} style={{ width: '100%' }}></div>
        ))}
      </div>

      <div className={styles.skeletonGrid}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={`sd-${i}`} className={styles.skeletonDay}></div>
        ))}
      </div>
    </div>
  )
}

export default CalendarSkeleton;