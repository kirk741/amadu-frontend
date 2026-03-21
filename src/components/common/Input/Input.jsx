import styles from './Input.module.css';

const Input = ({
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  ...props
}) => {
  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.inputInvalid : ''} ${className || ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;