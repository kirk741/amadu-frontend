import { useNavigate } from "react-router-dom";
import * as Icons from '../../../../assets/icons';
import styles from './UserInfo.module.css';

const UserInfo = ({ user, isLoading }) => {
  const navigate = useNavigate();

  return (<>
    {
      isLoading ? (
        <div className={styles.logContainer} >
          <div className={styles.skeletonCircle}></div>
          <div className={styles.logDataContainer}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLineSmall}></div>
          </div>
        </div >
      ) : (
        <div className={styles.userContainer} onClick={() => navigate(`/user/${user?.id}`)}>
          {
            !user?.media[0].file_path ? <img
              className={`${styles.psychologistImage} ${styles.userAvatar}`}
              src={`${process.env.REACT_APP_API_URL}/storage/${user?.media[0].file_path}`}
              alt={user?.name}
            /> : <span className={styles.psychologistImage} ><Icons.Profile /></span>
          }
          <div className={styles.userData}>
            <span>{user?.name}</span>
            <small>{user?.last_seen_at || "Был(а) в сети"}</small>
          </div>
        </div>)
    }
  </>)
}

export default UserInfo;