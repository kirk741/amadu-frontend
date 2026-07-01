import { useEffect, useState } from 'react';
import List from '../../../components/ui/List/List';
import Modal from '../../../components/ui/Modal/Modal';
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/Textarea/Textarea';
import FileInput from '../../../components/ui/FileInput/FileInput';
import { useEvents } from '../../../hooks/useEvents';
import * as Icons from '../../../assets/icons';

const EventsPage = () => {
  const { getEvents, pagination, isLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ open: false, type: 'create' }); 
  const [activeItem, setActiveItem] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [formFields, setFormFields] = useState({ title: '', description: '', event_date: '', location: '' });
  const [posterFile, setPosterFile] = useState(null);
  const [initialPosterPreview, setInitialPosterPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const loadPage = async (page, search) => {
    const cleanPage = typeof page === 'string' ? page.replace(/\D/g, '') : page;
    const pageNumber = Number(cleanPage) || 1;
    const result = await getEvents(pageNumber, search);
    setData(result || []);
    setIsFirstLoad(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPage(1, searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const mapEventToCard = (item) => {
    const media = item?.media && item.media.length > 0 ? item.media[0] : null;
    const posterPath = media ? media.file_path : null;
    let posterUrl = null;
    if (posterPath) {
      posterUrl = posterPath.startsWith('http')
        ? posterPath
        : `${process.env.REACT_APP_API_URL}/storage/${posterPath}`;
    }
    const formattedDate = new Date(item.event_date).toLocaleString('ru', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
    return {
      id: item.id,
      imageUrl: posterUrl,
      buttonIcons: [Icons.More],
      title: item.title,
      description: [
        <span key="ev-1">{item.location}</span>,
        <br key="ev-2" />,
        <span key="ev-3" style={{ fontSize: '13px', color: '#666' }}>{formattedDate}</span>
      ]
    };
  };

  const handleOpenCreate = () => {
    setFormFields({ title: '', description: '', event_date: '', location: '' });
    setPosterFile(null);
    setInitialPosterPreview(null);
    setValidationErrors({});
    setModal({ open: true, type: 'create' });
  };

  const handleOpenEdit = (item) => {
    setActiveItem(item);
    const rawDate = new Date(item.event_date);
    const tzOffset = rawDate.getTimezoneOffset() * 60000;
    const localISODate = new Date(rawDate.getTime() - tzOffset).toISOString().slice(0, 16);
    const media = item?.media && item.media.length > 0 ? item.media[0] : null;
    const posterPath = media ? media.file_path : null;
    let posterUrl = null;
    if (posterPath) {
      posterUrl = posterPath.startsWith('http')
        ? posterPath
        : `${process.env.REACT_APP_API_URL}/storage/${posterPath}`;
    }
    setFormFields({
      title: item.title,
      description: item.description,
      event_date: localISODate,
      location: item.location
    });
    setPosterFile(null);
    setInitialPosterPreview(posterUrl); 
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
    formData.append('description', formFields.description);
    formData.append('event_date', formFields.event_date.replace('T', ' ') + ':00');
    formData.append('location', formFields.location);
    if (posterFile) {
      formData.append('poster', posterFile);
    }
    try {
      if (modal.type === 'create') {
        await createEvent(formData);
        setActionStatus('success_create');
      } else {
        await updateEvent(activeItem.id, formData);
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

  const listActions = [{ icon: <Icons.Plus />, label: 'Добавить мероприятие', onClick: handleOpenCreate }];
  
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
            await deleteEvent(activeItem.id);
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
    <List
      items={data || []}
      isLoading={isLoading || data === null}
      mapItem={mapEventToCard}
      onItemBtnClick={(item) => handleOpenOptions(item)} 
      onItemClick={(item) => handleOpenEdit(item)} 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      
      isEmpty={data !== null && !isLoading && data.length === 0}
      
      actions={listActions}
      pagination={pagination}
      onPageChange={(page) => loadPage(page, searchQuery)}
      emptyComponent={<div>Мероприятий не найдено. Создайте первое!</div>}
    >
      {modal.open && (
        <Modal
          onClose={() => { setModal({ ...modal, open: false }); setActionStatus(''); }}
          title={modal.type === 'create' ? 'Новое мероприятие' : modal.type === 'edit' ? 'Редактирование' : modal.type === 'delete' ? 'Удаление' : 'Управление афишей'}
          childrenData={modalButtons}
        >
          {actionStatus === 'success_create' && <span>Мероприятие успешно добавлено!</span>}
          {actionStatus === 'success_edit' && <span>Изменения успешно сохранены!</span>}
          {actionStatus === 'success_delete' && <span>Мероприятие полностью удалено!</span>}
          {actionStatus === 'error' && <span style={{ color: 'var(--invalid-color)' }}>Ошибка выполнения операции.</span>}
          {actionStatus === '' && (
            modal.type === 'options' ? (
              <span>Выберите action для мероприятия <strong>{activeItem?.title}</strong></span>
            ) : modal.type === 'delete' ? (
              <span>Вы действительно хотите удалить мероприятие <strong>{activeItem?.title}</strong>?</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input name="title" placeholder="Название мероприятия" value={formFields.title} onChange={handleInputChange} />
                {validationErrors.title && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.title}</small>}
                <Input name="location" placeholder="Место проведения" value={formFields.location} onChange={handleInputChange} />
                {validationErrors.location && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.location}</small>}
                <Input name="event_date" type="datetime-local" value={formFields.event_date} onChange={handleInputChange} />
                {validationErrors.event_date && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.event_date}</small>}
                <Textarea name="description" placeholder="Описание мероприятия" value={formFields.description} onChange={handleInputChange} />
                {validationErrors.description && <small style={{ color: 'var(--invalid-color)' }}>{validationErrors.description}</small>}
                <FileInput
                  name="poster"
                  label="Постер мероприятия:"
                  initialPreview={initialPosterPreview}
                  onChange={(compressedFile) => setPosterFile(compressedFile)}
                  error={validationErrors.poster}
                />
              </div>
            )
          )}
        </Modal>
      )}
    </List>
  );
};

export default EventsPage;
