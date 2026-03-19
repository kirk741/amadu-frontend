import styles from './Container.module.css';
import Button from '../Button/Button';

const Container = ({ children, buttonIcons = [] }) => {
  return <div className={styles.container}>
    <div className={styles.childrenContainer}>
      {children}
    </div>
    <div>
      {buttonIcons.map((Icon, index) => (
        <Button className={styles.button} key={index} noBg={true} shadowType={null}>
          <Icon />
        </Button>
      ))}
    </div>
  </div>
}

export default Container;