import Container from "../Container/Container";
import { Link } from 'react-router-dom';
import styles from './EmptyCard.module.css';

const EmptyCard = ({ link }) => {
  return (
    <>
      <Container>
        <div className={styles.content}>
          <h3 className={styles.title}>Пока нет записей</h3>
          <Link to={link}>Добавить запись</Link>
        </div>
      </Container>
    </>
  )
}

export default EmptyCard;