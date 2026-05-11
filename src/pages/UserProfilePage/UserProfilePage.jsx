import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import UserSkeleton from "./UserSkeleton/UserSkeleton";
import Container from "../../components/ui/Container/Container";
import Button from '../../components/ui/Button/Button';
import * as Icons from '../../assets/icons';
import styles from './UserProfilePage.module.css';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user, isLoading } = useUser(id);
  const navigate = useNavigate();

  if (isLoading) return <Container><UserSkeleton /></Container>;
  if (!user) return <Container>Пользователь не найден</Container>;

  return (
    <Container>
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
          <small>{user.last_seen_at || 'В сети недавно'}</small>
          <div className={styles.buttonContainer}>
            <Button onClick={() => navigate(`/booking/${user.id}`)}><Icons.Appointment /></Button>
            <Button><Icons.Chats /></Button>
          </div>
        </div>
      </div>
      <p className={styles.bio}>{user.bio || 'Описание профиля отсутствует'}</p>
    </Container>
  );
};

export default UserProfilePage;