import styles from './Textarea.module.css';

const Textarea = ({ value, onChange, placeholder, name, id, required = false }) => {
  return (
    <div className={styles.textareaWrapper}>
      <textarea className={styles.textarea} value={value} onChange={onChange} placeholder={placeholder} name={name} id={id} required={required} />
    </div>
  )
}

export default Textarea;