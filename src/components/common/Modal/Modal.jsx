import styles from './Modal.module.css';
import Button from '../Button/Button';

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
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        {children}
        <div className={styles.actions}>
          <Button onClick={onConfirm}>{confirmText}</Button>
          {!hideCancel && <Button onClick={onCancel}>{cancelText}</Button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;