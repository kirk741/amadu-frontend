import { useState, useEffect } from 'react';
import styles from './FileInput.module.css';
import * as Icons from '../../../assets/icons';
import imageCompression from 'browser-image-compression';

const FileInput = ({ name = '', label = null, onChange, initialPreview = null, error }) => {
  const [preview, setPreview] = useState(initialPreview);

  useEffect(() => {
    if (typeof initialPreview === 'string') {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 200,
        useWebWorker: true
      };

      const compressedBlob = await imageCompression(file, options);

      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now()
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);

        if (onChange) onChange(compressedFile);
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      console.error('Ошибка при сжатии изображенияF');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onChange) onChange(file);
      };
      reader.readAsDataURL(file);
    }
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