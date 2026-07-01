import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/Textarea/Textarea';
import FileInput from '../../../components/ui/FileInput/FileInput';
import { useLibrary } from '../../../hooks/useLibrary';
import * as Icons from '../../../assets/icons';
import styles from './LibraryPage.module.css';

const LibraryPage = () => {
  const { getBooks, pagination, isLoading, createBook, updateBook, deleteBook } = useLibrary();

  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ open: false, type: 'create' });
  const [activeItem, setActiveItem] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [formFields, setFormFields] = useState({ title: '', author: '', comment: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [initialCoverPreview, setInitialCoverPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const loadPage = async (page, search) => {
    const cleanPage = typeof page === 'string' ? page.replace(/\D/g, '') : page;
    const pageNumber = Number(cleanPage) || 1;
    const result = await getBooks(pageNumber, search);
    setData(result || []);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPage(1, searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOpenCreate = () => {
    setFormFields({ title: '', author: '', comment: '' });
    setCoverFile(null);
    setInitialCoverPreview(null);
    setValidationErrors({});
    setModal({ open: true, type: 'create' });
  };

  const handleOpenEdit = (item) => {
    setActiveItem(item);
    const media = item?.media && item.media.length > 0 ? item.media[0] : null;
    const coverPath = media ? media.file_path : null;
    let coverUrl = null;
    if (coverPath) {
      coverUrl = coverPath.startsWith('http') ? coverPath : `${process.env.REACT_APP_API_URL}/storage/${coverPath}`;
    }
    setFormFields({ title: item.title, author: item.author, comment: item.comment || '' });
    setCoverFile(null);
    setInitialCoverPreview(coverUrl);
    setValidationErrors({});
    setModal({ open: true, type: 'edit' });
  };

  const handleOpenOptions = (item) => {
    setActiveItem(item);
    setModal({ open: true, type: 'options' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const executeSubmit = async () => {
    setValidationErrors({});
    const formData = new FormData();
    formData.append('title', formFields.title);
    formData.append('author', formFields.author);
    formData.append('comment', formFields.comment);
    if (coverFile) {
      formData.append('cover', coverFile);
    }
    try {
      if (modal.type === 'create') {
        await createBook(formData);
        setActionStatus('success_create');
      } else {
        await updateBook(activeItem.id, formData);
        setActionStatus('success_edit');
      }
      await loadPage(pagination?.current || 1, searchQuery);
    } catch (error) {
      if (error && error.errors) {
        setValidationErrors(error.errors);
      } else {
        setActionStatus('error');
      }
    }
  };

  const modalButtons = [];
  if (actionStatus.startsWith('success')) {
    modalButtons.push({ name: 'Отлично', onClick: () => { setModal({ ...modal, open: false }); setActionStatus(''); } });
  } else if (actionStatus === 'error') {
    modalButtons.push({ name: 'Назад', onClick: () => setActionStatus('') });
  } else if (modal.type === 'options') {
    modalButtons.push(
      { name: 'Удалить', preventClose: true, onClick: () => setModal({ ...modal, type: 'delete' }) },
      { name: 'Изменить', preventClose: true, onClick: () => handleOpenEdit(activeItem) },
    );
  } else if (modal.type === 'delete') {
    modalButtons.push(
      {
        name: 'Да, удалить',
        preventClose: true,
        onClick: async () => {
          try {
            await deleteBook(activeItem.id);
            setActionStatus('success_delete');
            await loadPage(pagination?.current || 1, searchQuery);
          } catch (e) {
            setActionStatus('error');
          }
        }
      },
      { name: 'Отмена', onClick: () => setModal({ ...modal, open: false }) }
    );
  } else {
    modalButtons.push(
      { name: modal.type === 'create' ? 'Создать' : 'Сохранить', preventClose: true, onClick: executeSubmit },
      { name: 'Отмена', onClick: () => setModal({ ...modal, open: false }) }
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.searchWrapper}>
        <Input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading || data === null ? (
        <div className={styles.libraryGrid}>
          {[1, 2, 4].map(i => (
            <div key={i} className={styles.skeletonBookWrapper}>
              <div className={styles.skeletonBook} />
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonSubHeader} />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className={styles.emptyState}>Книг не найдено.</div>
      ) : (
        <div className={styles.libraryGrid}>
          {data.map((item) => {
            const media = item?.media && item.media.length > 0 ? item.media[0] : null;
            const coverPath = media ? media.file_path : null;
            const coverUrl = coverPath
              ? (coverPath.startsWith('http') ? coverPath : `${process.env.REACT_APP_API_URL}/storage/${coverPath}`)
              : null;
            return (
              <div key={item.id} className={styles.bookCard} onClick={() => handleOpenEdit(item)}>
                <div className={styles.coverWrapper}>
                  {coverUrl ? (
                    <img src={coverUrl} alt={item.title} className={styles.bookCover} />
                  ) : (
                    <div className={styles.noCover}><Icons.Plus /></div>
                  )}
                  <button
                    className={styles.optionsBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenOptions(item);
                    }}
                  >
                    <Icons.More />
                  </button>
                </div>
                <h3 className={styles.bookTitle}>{item.title}</h3>
                <p className={styles.bookAuthor}>{item.author}</p>
              </div>
            );
          })}
        </div>
      )}

      <button className={styles.floatingAddBtn} onClick={handleOpenCreate}>
        <Icons.Plus />
      </button>

      {pagination && pagination.last > 1 && data !== null && (
        <div className={styles.paginationContainer}>
          {Array.from({ length: pagination.last }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`${styles.pageBtn} ${pagination.current === page ? styles.activePageBtn : ''}`}
              onClick={() => loadPage(page, searchQuery)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {modal.open && (
        <Modal
          onClose={() => { setModal({ ...modal, open: false }); setActionStatus(''); }}
          title={modal.type === 'create' ? 'Новая книга' : modal.type === 'edit' ? 'Редактирование' : modal.type === 'delete' ? 'Удаление книги' : 'Управление'}
          childrenData={modalButtons}
        >
          {actionStatus === 'success_create' && <span>Книга успешно добавлена в библиотеку!</span>}
          {actionStatus === 'success_edit' && <span>Изменения успешно сохранены!</span>}
          {actionStatus === 'success_delete' && <span>Книга удалена из базы.</span>}
          {actionStatus === 'error' && <span style={{ color: 'var(--invalid-color)' }}>Ошибка выполнения операции.</span>}
          {actionStatus === '' && (
            modal.type === 'options' ? (
              <span>Выберите действие для книги <strong>{activeItem?.title}</strong>:</span>
            ) : modal.type === 'delete' ? (
              <span>Вы действительно хотите удалить книгу <strong>{activeItem?.title}</strong>?</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input name="title" placeholder="Название книги" value={formFields.title} onChange={handleInputChange} />
                {validationErrors.title && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.title}</small>}
                <Input name="author" placeholder="Автор" value={formFields.author} onChange={handleInputChange} />
                {validationErrors.author && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.author}</small>}
                <Textarea name="comment" placeholder="Рецензия или комментарий к книге" value={formFields.comment} onChange={handleInputChange} />
                {validationErrors.comment && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.comment}</small>}
                <FileInput
                  name="cover"
                  label="Обложка книги:"
                  initialPreview={initialCoverPreview}
                  onChange={(compressedFile) => setCoverFile(compressedFile)}
                  error={validationErrors.cover}
                />
              </div>
            )
          )}
        </Modal>
      )}
    </div>);
}

export default LibraryPage;