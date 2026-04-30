import styles from './PhoneSkeleton.module.css';

const PhoneSkeleton = () => (
  <div className={styles.phoneDetailsSkeleton}>
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonSmall} />
    <div className={styles.skeletonText} />
    <div className={styles.skeletonText} style={{ width: '80%' }} />
    <div className={styles.skeletonButton} />
  </div>
);

export default PhoneSkeleton;