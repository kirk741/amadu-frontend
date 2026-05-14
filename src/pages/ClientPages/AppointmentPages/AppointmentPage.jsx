import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyBookings } from "../../../hooks/useMyBookings";
import AppointmentSkeleton from "./AppointmentSkeleton/AppointmentSkeleton";
import styles from './AppointmentPage.module.css';
import Modal from "../../../components/ui/Modal/Modal";
import Container from "../../../components/ui/Container/Container";
import Button from "../../../components/ui/Button/Button";
import AppointmentModal from "./AppointmentModal/AppointmentModal";

const AppointmentPage = () => {
  const [data, setData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const { id } = useParams();
  const { getAppointment, isLoading, cancelAppointment } = useMyBookings();

  useEffect(() => {
    const getData = async () => {
      const result = await getAppointment(id);
      setData(result);
    };

    getData();
  }, [id]);

  if (isLoading) return <Container><AppointmentSkeleton /></Container>;
  if (!data) return <Container>Запись не найдена</Container>;

  return <>
    <Container>
      <div className={styles.container}>
        <h3 className={styles.title}>Начало: {new Date(data.schedule.start_time).toLocaleString('ru', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</h3>
        <span>Конец: {new Date(data.schedule.end_time).toLocaleString('ru', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
        <div className={styles.dataContainer}>
          <span>Психолог: <Link to={`/user/${data.psychologist.id}`}>{data.psychologist.name}</Link></span>
          <p>Email: {data.psychologist.email}</p>
        </div>
      </div>

      <Button
        className={styles.cancelBtn}
        onClick={() => setIsModalOpen(true)}
      >
        Отменить запись
      </Button>
    </Container>
    {isModalOpen && (
      <AppointmentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        status={status}
        setStatus={setStatus}
        data={data}
      />
    )}
  </>
}

export default AppointmentPage;