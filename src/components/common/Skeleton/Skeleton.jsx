import Container from "../Container/Container";
import styles from './Skeleton.module.css';

const Skeleton = ({n: n}) => {
  return (
    <Container key={n}>
      <div className={styles.logContainer}>
        <div className={styles.skeletonCircle}></div>
        <div className={styles.logDataContainer}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLineSmall}></div>
        </div>
      </div>
    </Container>
  )
}

export default Skeleton;