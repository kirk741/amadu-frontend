import styles from './Appointment.module.css';
import * as Icons from '../../../../assets/icons';
import Container from '../../../../components/ui/Container/Container';
import { Link, useNavigate } from 'react-router-dom';
import { useMyBookings } from '../../../../hooks/useMyBookings';
import { useEffect, useState } from 'react';
import Modal from '../../../../components/ui/Modal/Modal';

const Appointment = () => {
  const { upcoming, isLoading } = useMyBookings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return <Container className={styles.skeletonContainer}><div className={styles.skeletonTitle}></div><div className={styles.skeletonDescription}></div></Container>;

  return (<>
    <Container
      buttonIcons={[Icons.More]}
      btnOnClick={(e) => { e.stopPropagation(); setIsModalOpen(true) }}
      onClick={() => navigate('/appointments')}
    >
      {
        upcoming ? (<div className={styles.upcomingInfo}>
          <div className={styles.header}>
            <span>Ближайшая сессия: {new Date(upcoming.schedule.start_time).toLocaleDateString('ru', { day: 'numeric', month: 'long' })} в {new Date(upcoming.schedule.start_time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className={styles.psychologist}>
            Психолог: <Link to={`/user/${upcoming.psychologist.id}`} onClick={(e) => e.stopPropagation()}>{upcoming.psychologist.name}</Link>
          </div>
        </div>)
          : (
            <span className={styles.upcomingInfo}>У вас нет подтверждённых записей. <Link to='/appointments'>Просмотреть заявки</Link></span>
          )
      }
    </Container>

    {
      isModalOpen && <Modal
        onClose={() => setIsModalOpen(false)}
        childrenData={[
          {
            name: 'Просмотреть все заявки',
            onClick: () => navigate('/appointments')
          }
        ]}
      >
      </Modal >
    }
  </>)
}

export default Appointment;