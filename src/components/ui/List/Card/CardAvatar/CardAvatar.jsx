import styles from './CardAvatar.module.css';
import * as Icons from '../../../../../assets/icons';

const CardAvatar = ({ type, imageUrl }) => {
  return (
    <div className={styles.avatarWrapper}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className={styles.typeImage} />
      ) : (
        <div className={`${styles.typeIcon} ${styles[type]}`}>
          {type === 'feelings' && <Icons.Heart />}
          {type === 'personal' && <Icons.Diary />}
          {type === 'user' && <Icons.Profile />}
          {type === 'phone' && <Icons.Phone />}
          {type === 'food' && <Icons.Food />}
        </div>
      )}
    </div>
  );
};


export default CardAvatar;