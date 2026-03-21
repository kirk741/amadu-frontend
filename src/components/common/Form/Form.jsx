import styles from './Form.module.css';

const Form = ({ children, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  
  return <form className={styles.form} onSubmit={handleSubmit} noValidate>
    {children}
  </form>
}

export default Form;