import { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import Button from '../Button/Button';
import * as Icons from '../../../assets/icons';

const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'ОК',
  cancelText = 'Отмена',
  hideCancel = false
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      // Когда isOpen становится false, включаем анимацию закрытия
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // 300ms — время анимации в CSS
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.overlay} ${isClosing ? styles.overlayExit : ''}`} 
      onClick={onCancel}
    >
      <div 
        className={`${styles.modal} ${isClosing ? styles.modalExit : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onCancel}>
          <Icons.X />
        </button>

        <div className={styles.handle} onClick={onCancel} />
        
        {title && <h3 className={styles.title}>{title}</h3>}
        
        <div className={styles.content}>
          {children}
        </div>

        <div className={styles.actions}>
          <Button onClick={onConfirm} shadowType="m">{confirmText}</Button>
          {!hideCancel && (
            <Button onClick={onCancel} noBg shadowType={null} className={styles.cancelBtn}>
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
