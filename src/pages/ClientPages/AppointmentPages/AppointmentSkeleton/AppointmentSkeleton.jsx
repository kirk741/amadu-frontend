import styles from './AppointmentSkeleton.module.css';

const AppointmentSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonSubHeader} />

      <div className={styles.dataContainer}>
        <div className={styles.skeletonText} style={{ width: '60%' }} />
        <div className={styles.skeletonText} style={{ width: '40%' }} />
      </div>

      <div className={styles.skeletonButton} />
    </div>
  )
}

export default AppointmentSkeleton;