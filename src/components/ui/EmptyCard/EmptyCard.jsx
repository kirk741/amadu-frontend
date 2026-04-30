import Container from "../Container/Container";
import { Link } from 'react-router-dom';
import styles from './EmptyCard.module.css';

const EmptyCard = ({ link, text = 'Пока нет записей', linkText = 'Добавить запись' }) => {
  return (
    <>
      <Container>
        <div className={styles.content}>
          <h3>{text}</h3>
          <Link to={link}>{linkText}</Link>
        </div>
      </Container>
    </>
  )
}

export default EmptyCard;