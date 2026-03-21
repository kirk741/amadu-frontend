import React, { useEffect, useState } from 'react';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import FileInput from '../../components/common/FileInput/FileInput';
import Modal from '../../components/common/Modal/Modal';
import styles from './ProfilePage.module.css';
import client from '../../api/client';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth_date: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    onConfirm: null,
    hideCancel: false
  });

  const loadUserData = async () => {
    try {
      const response = await client('/user/me');
      console.log('Ответ сервера /user/me:', response);
      const userData = response.data || response.user || response;

      if (userData && userData.id) {
        let formattedDate = '';
        if (userData.birth_date) {
          try {
            const dateObj = new Date(userData.birth_date);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn('Не удалось преобразовать дату', userData.birth_date);
          }
        }

        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          birth_date: formattedDate,
          bio: userData.bio || ''
        }));

        let avatarPath = null;
        if (userData.media) {
          if (Array.isArray(userData.media) && userData.media.length) {
            avatarPath = userData.media[0].file_path;
          } else if (userData.media.file_path) {
            avatarPath = userData.media.file_path;
          }
        } else if (userData.avatar) {
          avatarPath = userData.avatar;
        } else if (userData.avatar_url) {
          avatarPath = userData.avatar_url;
        }

        if (avatarPath) {
          const fullUrl = avatarPath.startsWith('http')
            ? avatarPath
            : `${process.env.REACT_APP_API_URL}/storage/${avatarPath}`;
          setAvatarUrl(fullUrl);
        }
      } else {
        console.error('Нет данных пользователя');
        localStorage.clear();
        window.location.assign('/login');
      }
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
      if (error.status === 401 || error.status === 404 || error.message === 'Не авторизован') {
        localStorage.clear();
        window.location.assign('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'password' && value === '') {
        newData.confirmPassword = '';
        if (errors.confirmPassword) {
          setErrors(prevErr => ({ ...prevErr, confirmPassword: null }));
        }
      }
      return newData;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, title: '', onConfirm: null, hideCancel: false });
  };

  const showModal = (title, onConfirm, hideCancel = false) => {
    setModalConfig({
      isOpen: true,
      title,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      hideCancel
    });
  };

  const performSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ['Пароли не совпадают'] });
      return;
    }

    setErrors({});
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'confirmPassword') return;
      if (formData[key] && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    data.append('_method', 'PATCH');

    try {
      await client('/user/me', {
        method: 'POST',
        body: data
      });

      await loadUserData();

      showModal("Данные успешно сохранены!", () => {
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setAvatarFile(null);
      }, true);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        showModal(error.message || "Произошла ошибка при сохранении.", null);
      }
    }
  };

  const handleSave = () => {
    showModal("Сохранить изменения?", performSave);
  };

  const performLogout = async () => {
    try {
      await client('/auth/logout', { method: 'POST' });
      localStorage.clear();
      window.location.assign('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      showModal("Ошибка при выходе из системы", null);
    }
  };

  const performDeleteAccount = async () => {
    try {
      await client('/user/me', { method: 'DELETE' });
      localStorage.clear();
      window.location.assign('/login');
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showModal(error.message || "Ошибка при удалении аккаунта", null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <FileInput onChange={handleAvatarChange} initialPreview={avatarUrl} />
          <span className={styles.changePhotoLabel}>Сменить фото</span>
        </div>

        <div className={styles.formFields}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            error={errors.name?.[0]}
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            error={errors.email?.[0]}
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Новый пароль"
            error={errors.password?.[0]}
          />
          {formData.password && (
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите пароль"
              error={errors.confirmPassword?.[0]}
            />
          )}
          <Input
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            placeholder="Дата рождения"
            error={errors.birth_date?.[0]}
          />
          <Input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Описание профиля"
            error={errors.bio?.[0]}
          />
        </div>

        <div className={styles.actions}>
          <Button shadowType="s" onClick={handleSave}>
            Сохранить изменения
          </Button>
          <Button shadowType="s" onClick={() => showModal("Вы уверены, что хотите выйти?", performLogout)}>
            Выйти
          </Button>
          <Button
            shadowType="s"
            className={styles.deleteBtn}
            onClick={() => showModal("Удалить аккаунт безвозвратно? Это действие нельзя отменить.", performDeleteAccount)}
          >
            Удалить аккаунт
          </Button>
        </div>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
        confirmText="ОК"
        cancelText="Отмена"
        hideCancel={modalConfig.hideCancel}
      />
    </div>
  );
};

export default ProfilePage;