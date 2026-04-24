import { useParams } from "react-router-dom";
import Container from "../../components/common/Container/Container";
import { useEffect, useState } from "react";
import client from "../../api/client";
import styles from './UserProfilePage.module.css';
import Button from '../../components/common/Button/Button';
import * as Icons from '../../assets/icons';

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      setLoading(true);
      const response = await client(`/user/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  return (
    <Container>
      {loading ? (
        <>
          {/* Скелетон шапки: аватар + инфо */}
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
          {/* Скелетон БИО */}
          <div className={styles.skeletonBio} />
        </>
      ) : (
        user && (
          <>
            <div className={styles.userContainer}>
              <Container className={styles.image_container}>
                <img
                  className={styles.profile_image}
                  src={`${process.env.REACT_APP_API_URL}/storage/${user?.media?.[0]?.file_path}`}
                  alt={user.name}
                />
              </Container>
              <div className={styles.userInfoContainer}>
                <h3>{user.name}</h3>
                <small>{user.last_seen_at || '???'}</small>
                <div className={styles.buttonContainer}>
                  <Button><Icons.Appointment /></Button>
                  <Button><Icons.Chats /></Button>
                </div>
              </div>
            </div>
            <p className={styles.bio}>{user.bio}</p>
          </>
        )
      )}
    </Container>
  );
};

export default UserProfilePage;