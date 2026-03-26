import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import * as Icons from '../../../assets/icons';
import styles from './Modal.module.css';

const Modal = ({ childrenData = [], onClose }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(() => {
      onClose();
    }, 400);
  }

  return (
    <div className={styles.modalBg} onClick={handleClose}>
      <ul className={`${styles.modalContainer} ${isActive ? styles.active : ''}`}>
        <Button noBg={true} shadowType={null} className={styles.closeBtn} onClick={handleClose}><Icons.X /></Button>
        {
          childrenData.map((item, index) =>
            <li key={index} className={styles.modalButton}>
              <Button noBg={true} shadowType={null} onClick={item.onClick}>{item.name}</Button>
            </li>
          )
        }
      </ul>
    </div>
  )
};

export default Modal;
