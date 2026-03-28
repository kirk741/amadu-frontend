import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import * as Icons from '../../../assets/icons';
import styles from './Modal.module.css';

const Modal = ({ children, childrenData = [], onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsActive(false);
    setTimeout(() => {
      setShouldRender(false);
      if (onClose) onClose();
    }, 400);
  };

  const stopPropagation = (e) => e.stopPropagation();

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.modalBg} ${isActive ? styles.activeBg : ''}`}
      onClick={closeModal}
    >
      <ul
        className={`${styles.modalContainer} ${isActive ? styles.active : ''}`}
        onClick={stopPropagation}
      >
        <Button
          noBg={true}
          shadowType={null}
          className={styles.closeBtn}
          onClick={closeModal}
        >
          <Icons.X />
        </Button>

        {children && <li className={styles.modalContent}>{children}</li>}

        {childrenData.map((item, index) => (
          <li key={index} className={styles.modalButton}>
            <Button
              noBg={true}
              shadowType={null}
              onClick={() => {
                if (item.onClick) item.onClick();
                if (item.closeAfterClick) closeModal();
              }}
            >
              {item.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Modal;