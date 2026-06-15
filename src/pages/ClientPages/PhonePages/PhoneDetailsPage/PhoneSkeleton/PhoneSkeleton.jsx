import styles from './PhoneSkeleton.module.css';

const PhoneSkeleton = () => (<>
  <div className={styles.skeletonTitle} />
  <div className={styles.skeletonSmall} />
  <div className={styles.skeletonText} />
  <div className={styles.skeletonText} style={{ width: '80%' }} />
</>
);

export default PhoneSkeleton;