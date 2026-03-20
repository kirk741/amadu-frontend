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

  const handleFocus = (e) => {
    if (type === 'date') e.target.type = 'date';
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    if (type === 'date' && !e.target.value) e.target.type = 'text';
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.inputInvalid : ''} ${className || ''}`}
        type={type === 'date' ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;