import * as Icons from '../../../../assets/icons';
import Container from '../../Container/Container';
import CardAvatar from './CardAvatar/CardAvatar';
import styles from './Card.module.css';

const Card = ({ 
  title, 
  description, 
  date, 
  type, 
  imageUrl, 
  btnOnClick, 
  onClick,
  buttonIcons = [Icons.More]
}) => {
  return (
    <Container
      buttonIcons={buttonIcons}
      className={styles.container}
      btnOnClick={btnOnClick}
      onClick={onClick}
    >
      {(type || imageUrl) && <CardAvatar type={type} imageUrl={imageUrl} />}

      <div className={styles.textData}>
        <h3>{title || 'Без названия'}</h3>
        {description && <p>{description}</p>}
        {date && <small>{new Date(date).toLocaleDateString()}</small>}
      </div>
    </Container>
  );
};

export default Card;