import * as Icons from '../../../../assets/icons';
import Container from '../../Container/Container';
import CardAvatar from './CardAvatar/CardAvatar';
import styles from './Card.module.css';

const Card = ({ title, description, date, type, imageUrl, btnOnClick, onClick }) => {
  return (
    <Container
      buttonIcons={[Icons.More]}
      className={styles.container}
      btnOnClick={btnOnClick}
      onClick={onClick}
    >
      <div className={styles.avatarWrapper}>
        <CardAvatar type={type} imageUrl={imageUrl} />
      </div>

      <div className={styles.textData}>
        <h3>{title || 'Без названия'}</h3>
        {description && <p>{description}</p>}
        {date && <small>{new Date(date).toLocaleDateString()}</small>}
      </div>
    </Container>
  );
};

export default Card;