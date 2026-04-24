import React, { useState } from 'react';
import styles from './CreateDiaryPage.module.css';
import Button from '../../components/common/Button/Button';
import client from '../../api/client';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/common/Select/Select';
import FileInput from '../../components/common/FileInput/FileInput';

const CreateDiaryPage = () => {
  const [diaryType, setDiaryType] = useState('Дневник чувств');
  const [formData, setFormData] = useState({
    situation: '', thoughts: '', feelings: '', body_feelings: '', conclusion: '', // чувства
    title: '', content: '',
    cover: null
  });

  const navigate = useNavigate();

  const diaryOptions = ['Дневник чувств', 'Личный дневник', 'Дневник питания'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = async () => {
    let endpoint = '';
    const data = new FormData();

    if (diaryType === 'Дневник чувств') {
      endpoint = '/feelings-diaries';
      Object.keys(formData).forEach(key => {
        if (['situation', 'thoughts', 'feelings', 'body_feelings', 'conclusion'].includes(key)) {
          data.append(key, formData[key]);
        }
      });
    } else if (diaryType === 'Личный дневник') {
      endpoint = '/personal-diaries';
      data.append('title', formData.title);
      data.append('content', formData.content);
    } else {
      endpoint = '/food-diaries';
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.cover) data.append('cover', formData.cover);
    }

    try {
      await client(endpoint, { body: data });
      navigate('/diary');
    } catch (e) {
      console.error('Ошибка при сохранении:', e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        <div className={styles.selectWrapper}>
          <label className={styles.mainLabel}>Выберите тип дневника</label>
          <Select
            options={diaryOptions}
            value={diaryType}
            onChange={(val) => setDiaryType(val)}
          />
        </div>

        {diaryType === 'Дневник чувств' && (
          <>
            <textarea name="situation" className={styles.titleInput} placeholder="Ситуация" rows="1" value={formData.situation} onChange={handleChange} />
            <textarea name="thoughts" className={styles.descriptionInput} placeholder="О чем вы думали?" value={formData.thoughts} onChange={handleChange} />
            <textarea name="feelings" className={styles.descriptionInput} placeholder="Что вы почувствовали?" value={formData.feelings} onChange={handleChange} />
            <textarea name="body_feelings" className={styles.descriptionInput} placeholder="Телесные ощущения?" value={formData.body_feelings} onChange={handleChange} />
            <textarea name="conclusion" className={styles.descriptionInput} placeholder="Какие выводы?" value={formData.conclusion} onChange={handleChange} />
          </>
        )}

        {(diaryType === 'Личный дневник' || diaryType === 'Дневник питания') && (
          <>
            <textarea name="title" className={styles.titleInput} placeholder="Заголовок" rows="1" value={formData.title} onChange={handleChange} />

            {diaryType === 'Дневник питания' && (
              <div className={styles.fileWrapper}>
                <FileInput
                  label="Добавить фото еды"
                  onChange={(file) => setFormData(prev => ({ ...prev, cover: file }))}
                />
              </div>
            )}

            <textarea name="content" className={styles.descriptionInput} placeholder="Запишите ваши мысли..." value={formData.content} onChange={handleChange} />
          </>
        )}

      </div>

      <div className={styles.footer}>
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
};

export default CreateDiaryPage;
