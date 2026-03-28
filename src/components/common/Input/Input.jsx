import styles from './Input.module.css';
import * as Icons from '../../../assets/icons/';
import Button from '../Button/Button';
import { useState } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);

  const changeVisibility = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.inputInvalid : ''} ${className || ''}`}
        type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        {...props}
      />
      {type === 'password' && <Button noBg shadowType={null} className={styles.inputIcon} onClick={changeVisibility}>{isVisible ? <Icons.Hide /> : <Icons.Open />}</Button>}
      {error && <span data-testid={`${name}-error`} className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;