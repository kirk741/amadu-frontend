import { useEffect, useState } from "react";
import client from "../../api/client";
import styles from './PsychologistsPage.module.css';
import Container from "../../components/common/Container/Container";
import EmptyCard from "../../components/common/EmptyCard/EmptyCard";
import Modal from "../../components/common/Modal/Modal";
import * as Icons from '../../assets/icons';
import { useNavigate } from "react-router-dom";
import Skeleton from "../../components/common/Skeleton/Skeleton";

const PsychologistsPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const data = await client('/user');
      setUsers(data.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const openUserMenu = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <>
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton key={n} n={n} />
          ))}
        </>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyCard link={'/'} />
      )}

      {!isLoading && users.map((user) => (
        <Container
          key={user.id}
          buttonIcons={[Icons.More]}
          className={styles.infoContainer}
          onClick={() => openUserMenu(user)}
        >
          {user.media && user.media[0] && (
            <img
              className={styles.image}
              src={`${process.env.REACT_APP_API_URL}/storage/${user.media[0]?.file_path}`}
              alt={user.name}
            />
          )}
          <div className={styles.userDataContainer}>
            <h3>{user.name}</h3>
            <small>{user.bio}</small>
          </div>
        </Container>
      ))}

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          childrenData={[
            {
              name: 'Записаться на приём',
              onClick: () => navigate(`/appointment/${selectedUser.id}`)
            },
            {
              name: 'Открыть чат',
              onClick: () => navigate(`/chats/${selectedUser.id}`)
            },
            {
              name: 'Профиль психолога',
              onClick: () => navigate(`/user/${selectedUser.id}`)
            },
          ]}
        >
          {selectedUser?.name}
        </Modal>
      )}
    </div>
  );
}

export default PsychologistsPage;
