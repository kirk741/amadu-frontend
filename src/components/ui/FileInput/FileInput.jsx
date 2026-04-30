import { useState, useEffect } from 'react';
import styles from './FileInput.module.css';
import * as Icons from '../../../assets/icons';

const FileInput = ({ name = '', label = null, onChange, initialPreview = null, error }) => {
  const [preview, setPreview] = useState(initialPreview);

  useEffect(() => {
    if (typeof initialPreview === 'string') {
      setPreview(initialPreview);
    }
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

  return <>
    <div className={styles.container}>
      {label && <span>{label}</span>}
      <label className={styles.uploadCard}>
        <input
          type="file"
          accept="image/*"
          name={name}
          onChange={handleFileChange}
          hidden
        />
        {preview ? (
          <img src={preview} alt="Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.plusIcon}><Icons.Plus /></div>
        )}
      </label>
    </div>
    {error && <span className={styles.errorText}>{error}</span>}
  </>;
};

export default FileInput;