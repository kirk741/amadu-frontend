import styles from './Appointment.module.css';
import * as Icons from '../../../../assets/icons';
import Container from '../../../../components/ui/Container/Container';

const Appointment = () => {
  return (
    <Container buttonIcons={[Icons.More]}>
      <span className={styles.text}>Нет предстоящих записей</span>
    </Container>
  )
}

export default Appointment;