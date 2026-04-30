import styles from './Container.module.css';
import Button from '../Button/Button';

const Container = ({ children, buttonIcons = [], onClick = null, btnOnClick = null, className='' }) => {
  return <div className={`${styles.container} ${className}`} onClick={onClick}>
    <div className={styles.childrenContainer}>
      {children}
    </div>
    <div>
      {buttonIcons.map((Icon, index) => (
        <Button className={styles.button} key={index} noBg={true} shadowType={null} onClick={btnOnClick}>
          <Icon />
        </Button>
      ))}
    </div>
  </div>
}

export default Container;