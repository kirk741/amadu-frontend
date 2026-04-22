import { useEffect, useState } from "react";
import client from "../../api/client";
import styles from './PsychologistsPage.module.css';
import Container from "../../components/common/Container/Container";
import EmptyCard from "../../components/common/EmptyCard/EmptyCard";
import Modal from "../../components/common/Modal/Modal";
import * as Icons from '../../assets/icons';

const PsychologistsPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (<div className={styles.container}>
    {
      isLoading && users.length === 0 && (
        <>
          {[1, 2, 3].map((n) => (
            <Container key={n}>
              <div className={styles.userContainer}>
                <div className={styles.skeletonCircle}></div>
                <div className={styles.userDataContainer}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLineSmall}></div>
                </div>
              </div>
            </Container>
          ))}
        </>
      )
    }
    {
      users.length === 0 && !isLoading && <EmptyCard link={'/'} />
    }
    {
      users.map((user, index) => {
        return <Container key={user.id} buttonIcons={[Icons.More]}>
          <div className={styles.userContainer}>
            { user.media[0]?.file_path &&
              <img className={styles.image} src={`${process.env.REACT_APP_API_URL}/storage/${user.media[0]?.file_path}`} alt={user.name} />
            }
            <div className={styles.userDataContainer}>
              <h3>{user.name}</h3>
              <small>{user.bio}</small>
            </div>
          </div>
        </Container>
      })
    }
    {
      isModalOpen &&
      <Modal
        onClose={() => setIsModalOpen(false)}
        childrenData={[
        ]}>
      </Modal>
    }
  </div>
  )
}

export default PsychologistsPage;