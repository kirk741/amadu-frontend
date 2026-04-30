import styles from '../../DiaryStyles.module.css';

const PersonalForm = ({ data, onChange }) => (
  <>
    <textarea name="title" className={styles.titleInput} placeholder="Заголовок" rows="1" value={data.title} onChange={onChange} />
    <textarea name="content" className={styles.descriptionInput} placeholder="Запишите ваши мысли..." value={data.content} onChange={onChange} />
  </>
);

export default PersonalForm;