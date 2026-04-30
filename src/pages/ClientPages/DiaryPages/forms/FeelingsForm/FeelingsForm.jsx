import styles from '../../DiaryStyles.module.css';

const FeelingsForm = ({ data, onChange }) => (
  <>
    <textarea 
      name="situation" 
      className={styles.titleInput}
      placeholder="Ситуация" 
      value={data.situation || ''} 
      onChange={onChange} 
    />
    <textarea 
      name="thoughts" 
      className={styles.descriptionInput}
      placeholder="О чем вы думали?" 
      value={data.thoughts || ''} 
      onChange={onChange} 
    />
    <textarea 
      name="feelings" 
      className={styles.descriptionInput} 
      placeholder="Что вы почувствовали?" 
      value={data.feelings || ''} 
      onChange={onChange} 
    />
    <textarea 
      name="body_feelings" 
      className={styles.descriptionInput} 
      placeholder="Телесные ощущения?" 
      value={data.body_feelings || ''} 
      onChange={onChange} 
    />
    <textarea 
      name="conclusion" 
      className={styles.descriptionInput} 
      placeholder="Какие выводы?" 
      value={data.conclusion || ''} 
      onChange={onChange} 
    />
  </>
);

export default FeelingsForm;
