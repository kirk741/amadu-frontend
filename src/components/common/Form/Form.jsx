import { useRef } from 'react';
import styles from './Form.module.css';

const Form = ({ children, onSubmit }) => {
  const formRef = useRef(null);
  return <form className={styles.form} onSubmit={onSubmit} ref={formRef} noValidate >
    {children}
  </form>
}

export default Form;