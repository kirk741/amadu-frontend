import styles from './ProfileSkeleton.module.css';

const ProfileSkeleton = () => (
  <div className={styles.skeletonForm}>
    <div className={styles.skeletonAvatar} />
    {[1, 2, 3].map(i => <div key={i} className={styles.skeletonInput} />)}
    <div className={styles.skeletonTextarea} />
    {[1, 2, 3].map(i => <div key={i + 3} className={styles.skeletonButton} />)}
  </div>
);
export default ProfileSkeleton;