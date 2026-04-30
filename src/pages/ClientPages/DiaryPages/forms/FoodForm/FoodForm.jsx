import FileInput from "../../../../../components/ui/FileInput/FileInput";
import styles from '../../DiaryStyles.module.css';

const FoodForm = ({ data, onChange, onFileChange }) => {
  const getPreviewUrl = () => {
    if (data?.id && data?.media?.length > 0) {
      const token = localStorage.getItem('token');
      const url = `${process.env.REACT_APP_API_URL}/food-diaries/${data.id}/file?token=${token}`;
      return url;
    }
    return null;
  };

  return (
    <>
      <textarea
        name="title"
        className={styles.titleInput}
        placeholder="Что вы съели?"
        rows="1"
        value={data.title || ''}
        onChange={onChange}
      />

      <div className={styles.fileWrapper}>
        <FileInput
          label="Фото блюда"
          initialPreview={getPreviewUrl()}
          onChange={onFileChange}
        />
      </div>

      <textarea
        name="content"
        className={styles.descriptionInput}
        placeholder="Ваши впечатления..."
        value={data.content || ''}
        onChange={onChange}
      />
    </>
  );
};

export default FoodForm;
