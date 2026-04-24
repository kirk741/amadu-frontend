import React, { useState } from 'react';
import styles from './CreateDiaryPage.module.css';
import Button from '../../components/common/Button/Button';
import client from '../../api/client';
import { useNavigate } from 'react-router-dom';

const CreateDiaryPage = () => {
  const [formData, setFormData] = useState({
    situation: '',
    thoughts: '',
    feelings: '',
    body_feelings: '',
    conclusion: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = async () => {
    try {
      const response = await client('/feelings-diaries', {
        body: formData
      });
      console.log('Ответ сервера:', response);
      navigate('/diary');
    } catch (e) {
      console.error('Реальная ошибка тут:', e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        <div className={styles.inputGroup}>
          <textarea
            name="situation"
            className={styles.titleInput}
            placeholder="Ситуация"
            rows="1"
            value={formData.situation}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="thoughts"
            className={styles.descriptionInput}
            placeholder="О чем вы думали в тот момент?"
            value={formData.thoughts}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="feelings"
            className={styles.descriptionInput}
            placeholder="Что вы почувствовали? (грусть, гнев, радость...)"
            value={formData.feelings}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}></label>
          <textarea
            name="body_feelings"
            className={styles.descriptionInput}
            placeholder="Телесные ощущения? (сжатие в груди, дрожь, тепло...)"
            value={formData.body_feelings}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <textarea
            name="conclusion"
            className={styles.descriptionInput}
            placeholder="Какие выводы можно сделать?"
            value={formData.conclusion}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className={styles.footer}>
        <Button onClick={handleSave}>
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default CreateDiaryPage;
