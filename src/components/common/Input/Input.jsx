import styles from './Input.module.css';

const Input = ({
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  ...props
}) => {
  return <input
    className={styles.input}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    name={name}
    {...props} />
}

export default Input;