import Button from '../../../components/common/Button/Button';
import styles from './HomePageOptions.module.css';
import * as Icons from '../../../assets/icons';

const HomePageOptions = () => {
  const buttons = [
    { name: 'Записаться на приём', Icon: null },
    { name: 'Коробочное дыхание', Icon: Icons.Exsercises },
    { name: 'Калимба (антистресс)', Icon: Icons.Music },
    { name: 'Заземление (5\u20114\u20113\u20112\u20111)', Icon: Icons.Touch },
    { name: 'Номера поддержки', Icon: Icons.Phone }
  ]
  return <div className={styles.buttonContainer}>
    {
      buttons.map(({ name, Icon }, index) =>
        <Button className={styles.button} key={index} shadowType={null} JustifyBetween={true}>
          <span>{name}</span>
          {Icon && <Icon className={styles.icon} />}
        </Button>
      )
    }
  </div>
}

export default HomePageOptions;