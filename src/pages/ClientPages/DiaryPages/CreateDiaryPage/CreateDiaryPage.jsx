import React, { useState } from 'react';
import Button from '../../../../components/ui/Button/Button';
import client from '../../../../api/client';
import { useNavigate } from 'react-router-dom';
import Select from '../../../../components/ui/Select/Select';
import FileInput from '../../../../components/ui/FileInput/FileInput';
import FeelingsForm from '../forms/FeelingsForm/FeelingsForm';
import PersonalForm from '../forms/PersonalForm/PersonalForm';
import FoodForm from '../forms/FoodForm/FoodForm';
import styles from '../DiaryStyles.module.css';
import { useCreateDiary } from '../../../../hooks/useCreateDiary';

const CreateDiaryPage = () => {
  const { diaryType, setDiaryType, formData, setFormData, handleChange, save } = useCreateDiary();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.selectWrapper}>
          <label className={styles.mainLabel}>Выберите тип дневника</label>
          <Select
            options={['Личный дневник', 'Дневник чувств', 'Дневник питания']}
            value={diaryType}
            onChange={setDiaryType}
          />
        </div>

        <div className={styles.formFields}>
          {diaryType === 'Дневник чувств' && (
            <FeelingsForm data={formData} onChange={handleChange} styles={styles} />
          )}

          {diaryType === 'Личный дневник' && (
            <PersonalForm data={formData} onChange={handleChange} styles={styles} />
          )}

          {diaryType === 'Дневник питания' && (
            <FoodForm
              data={formData}
              onChange={handleChange}
              styles={styles}
              onFileChange={(file) => setFormData(prev => ({ ...prev, cover: file }))}
            />
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button onClick={save} className={styles.saveButton}>Сохранить</Button>
      </div>
    </div>
  );
};

export default CreateDiaryPage;