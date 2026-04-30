import Button from '../../Button/Button';
import styles from './FloatButtons.module.css';

const FloatButtons = ({ actions = [] }) => {
  if (!actions.length) return null;

  return (
    <div className={styles.floatContainer}>
      {actions.map((action, index) => (
        <Button 
          key={index} 
          className={styles.floatButton} 
          onClick={action.onClick}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
};

export default FloatButtons;