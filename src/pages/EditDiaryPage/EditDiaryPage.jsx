import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditDiaryPage.module.css';
import Button from '../../components/common/Button/Button';
import client from '../../api/client';
import FileInput from '../../components/common/FileInput/FileInput';
import Loader from '../../components/common/Loader/Loader';

const EditDiaryPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    situation: '', thoughts: '', feelings: '', body_feelings: '', conclusion: '',
    title: '', content: '', cover: null, initialPreview: null
  });

  const getEndpoint = (diaryType) => {
    switch (diaryType) {
      case 'feelings': return `/feelings-diaries/${id}`;
      case 'personal': return `/personal-diaries/${id}`;
      case 'food': return `/food-diaries/${id}`;
      default: return `/feelings-diaries/${id}`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await client(getEndpoint(type));
        const data = response.data;

        setFormData({
          situation: data.situation || '',
          thoughts: data.thoughts || '',
          feelings: data.feelings || '',
          body_feelings: data.body_feelings || '',
          conclusion: data.conclusion || '',
          title: data.title || '',
          content: data.content || '',
          cover: null,
          initialPreview: data.media?.[0]
            ? `${process.env.REACT_APP_API_URL}/food-diaries/${id}/file?token=${localStorage.getItem('token')}`
            : null
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('_method', 'PATCH'); // Для Laravel PATCH через FormData

    if (type === 'feelings') {
      ['situation', 'thoughts', 'feelings', 'body_feelings', 'conclusion'].forEach(key => {
        data.append(key, formData[key] || '');
      });
    } else {
      data.append('title', formData.title || '');
      data.append('content', formData.content || '');
      if (formData.cover instanceof File) {
        data.append('cover', formData.cover);
      }
    }

    try {
      await client(getEndpoint(type), { body: data });
      navigate('/diary');
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.formFields}>
          {type === 'feelings' && (
            <>
              <textarea name="situation" className={styles.titleInput} placeholder="Ситуация" value={formData.situation} onChange={handleChange} />
              <textarea name="thoughts" className={styles.descriptionInput} placeholder="О чем вы думали?" value={formData.thoughts} onChange={handleChange} />
              <textarea name="feelings" className={styles.descriptionInput} placeholder="Что вы почувствовали?" value={formData.feelings} onChange={handleChange} />
              <textarea name="body_feelings" className={styles.descriptionInput} placeholder="Телесные ощущения?" value={formData.body_feelings} onChange={handleChange} />
              <textarea name="conclusion" className={styles.descriptionInput} placeholder="Какие выводы?" value={formData.conclusion} onChange={handleChange} />
            </>
          )}

          {(type === 'personal' || type === 'food') && (
            <>
              <textarea name="title" className={styles.titleInput} placeholder="Заголовок" value={formData.title} onChange={handleChange} />

              {type === 'food' && (
                <div className={styles.fileWrapper}>
                  <FileInput
                    label="Изменить фото еды"
                    initialPreview={formData.initialPreview}
                    onChange={(file) => setFormData(prev => ({ ...prev, cover: file }))}
                  />
                </div>
              )}

              <textarea name="content" className={styles.descriptionInput} placeholder="Ваши мысли..." value={formData.content} onChange={handleChange} />
            </>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button onClick={handleUpdate}>Сохранить изменения</Button>
      </div>
    </div>
  );
};

export default EditDiaryPage;
