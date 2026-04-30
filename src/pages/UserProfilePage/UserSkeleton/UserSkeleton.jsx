import styles from './UserSkeleton.module.css';

const UserSkeleton = () => (
  <>
    <div className={styles.userContainer}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.userInfoContainer}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonSmall} />
        <div className={styles.buttonContainer}>
          <div className={styles.skeletonCircleBtn} />
          <div className={styles.skeletonCircleBtn} />
        </div>
      </div>
    </div>
    <div className={styles.skeletonBio} />
  </>
);

export default UserSkeleton;
