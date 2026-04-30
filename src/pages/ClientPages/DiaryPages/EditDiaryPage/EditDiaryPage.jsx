import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FoodForm from '../forms/FoodForm/FoodForm';
import PersonalForm from '../forms/PersonalForm/PersonalForm';
import FeelingsForm from '../forms/FeelingsForm/FeelingsForm';
import Button from '../../../../components/ui/Button/Button';
import { diariesApi } from '../../../../api/diaries';
import Loader from '../../../../components/ui/Loader/Loader';
import styles from '../DiaryStyles.module.css';

const EditDiaryPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await diariesApi.getOne(type, id);
        setFormData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleUpdate = async () => {
    try {
      await diariesApi.update(type, id, formData);
      navigate('/diary');
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !formData) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.selectWrapper}>
          <label className={styles.mainLabel}>Редактирование записи</label>
        </div>

        <div className={styles.formFields}>
          {type === 'feelings' && (
            <FeelingsForm data={formData} onChange={handleChange} styles={styles} />
          )}

          {type === 'personal' && (
            <PersonalForm data={formData} onChange={handleChange} styles={styles} />
          )}

          {type === 'food' && (
            <FoodForm
              key={formData.id}
              data={formData}
              onChange={handleChange}
              styles={styles}
              onFileChange={(file) => setFormData(prev => ({ ...prev, cover: file }))}
            />
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button onClick={handleUpdate} className={styles.saveButton}>Сохранить изменения</Button>
      </div>
    </div>
  );
};

export default EditDiaryPage;