import Button from '../../../components/common/Button/Button';
import styles from './HomePageOptions.module.css';
import * as Icons from '../../../assets/icons';
import { useNavigate } from 'react-router-dom';

const HomePageOptions = () => {
  const navigate = useNavigate();
  const buttons = [
    { name: 'Записаться на приём', Icon: null, link: '/psychologists' },
    { name: 'Коробочное дыхание', Icon: Icons.Exsercises },
    { name: 'Калимба (антистресс)', Icon: Icons.Music },
    { name: 'Заземление (5\u20114\u20113\u20112\u20111)', Icon: Icons.Touch },
    { name: 'Номера поддержки', Icon: Icons.Phone }
  ]
  return <div className={styles.buttonContainer}>
    {
      buttons.map(({ name, Icon, link }, index) =>
        <Button className={styles.button} key={index} shadowType={null} JustifyBetween={true} onClick={() => navigate(link)}>
          <span>{name}</span>
          {Icon && <Icon className={styles.icon} />}
        </Button>
      )
    }
  </div>
}

export default HomePageOptions;