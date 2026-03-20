import { useState, useEffect } from 'react';
import styles from './FileInput.module.css';
import * as Icons from '../../../assets/icons';

const FileInput = () => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('userAvatar');
    if (savedImage) {
      setPreview(savedImage);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      localStorage.setItem('userAvatar', base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>Загрузите фото профиля</span>

      <label className={styles.uploadCard}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
        
        {preview ? (
          <img src={preview} alt="Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.plusIcon}><Icons.Plus /></div>
        )}
      </label>
    </div>
  );
};

export default FileInput;
