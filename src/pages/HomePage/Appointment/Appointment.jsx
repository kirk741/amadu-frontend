import styles from './Appointment.module.css';
import * as Icons from '../../../assets/icons';
import Container from '../../../components/common/Container/Container';

const Appointment = () => {
  return (
    <Container className={styles.container} buttonIcons={[Icons.More]}>
      Нет предстоящих записей
    </Container>
  )
}

export default Appointment;