import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diariesApi } from '../api/diaries';

export const useCreateDiary = () => {
  const navigate = useNavigate();

  const [diaryType, setDiaryType] = useState('Личный дневник');

  const [formData, setFormData] = useState({
    situation: '', thoughts: '', feelings: '', body_feelings: '', conclusion: '',
    title: '', content: '', cover: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Автовысота
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const save = async () => {
    try {
      await diariesApi.create(diaryType, formData);
      navigate('/diary');
    } catch (e) {
      console.error(e);
    }
  };

  return { diaryType, setDiaryType, formData, setFormData, handleChange, save };
};