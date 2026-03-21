import { useState, useEffect } from 'react';
import styles from './FileInput.module.css';
import * as Icons from '../../../assets/icons';

const FileInput = ({ onChange, initialPreview = null }) => {
  const [preview, setPreview] = useState(initialPreview);

  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      if (onChange) onChange(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.container}>
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