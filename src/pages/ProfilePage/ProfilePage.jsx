import { useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import styles from "./ProfilePage.module.css";
import Form from "../../components/common/Form/Form";
import Button from "../../components/common/Button/Button";
import Textarea from "../../components/common/Textarea/Textarea";
import FileInput from "../../components/common/FileInput/FileInput";
import Modal from "../../components/common/Modal/Modal";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import Loader from "../../components/common/Loader/Loader";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    bio: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    get: false,
    save: false,
    logout: false,
    delete: false
  });
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const getProfileData = async () => {
    setLoading((prev) => ({ ...prev, get: true }));

    try {
      const response = await client('/user/me');
      const data = response.data;
      const avatarUrl = data.media?.[0]?.file_path ? `${process.env.REACT_APP_API_URL}/storage/${data.media[0].file_path}` : null;
      if (!response.success) throw data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        password_confirmation: data.password_confirmation || '',
        bio: data.bio || '',
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }

  useEffect(() => {
    getProfileData();
  }, []);

  const handleLogout = async () => {
    setLoading(prev => ({ ...prev, logout: true }));

    try {
      await client('/auth/logout', { method: 'POST' });

    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');

      navigate('/login');
    }
  };

  const handleDelete = async () => {
    setLoading(prev => ({ ...prev, delete: true }));

    try {
      await client('/user/me', { method: 'DELETE' });
      setModal({ type: 'deleted' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, save: true }));
    setErrors({});

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);

      if (formData.password) {
        form.append('password', formData.password);
        form.append('password_confirmation', formData.password_confirmation);
      }
      if (formData.bio) {
        form.append('bio', formData.bio);
      }
      if (formData.avatar instanceof File) {
        form.append('avatar', formData.avatar);
      }
      form.append('_method', 'PATCH');
      const response = await client('/user/me', { body: form });
      if (!response.success) throw response.data;
    } catch (error) {
      console.error(error);

      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  return (<>
    <div className={styles.formContainer}>
      {loading.get ? (
        <div className={styles.skeletonForm}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonTextarea} />
          <div className={styles.skeletonButton} />
          <div className={styles.skeletonButton} />
          <div className={styles.skeletonButton} />
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FileInput
            name="avatar"
            label='Нажмите на фото для&nbsp;изменения'
            initialPreview={formData.avatar}
            onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))}
            error={errors.avatar}
          />
          <Input name='name' placeholder="Введите ваше имя*" value={formData.name} onChange={handleChange} error={errors.name} />
          <Input autoComplete="username" name='email' type="email" placeholder="Введите email*" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input autoComplete="new-password" name='password' type="password" placeholder="Введите пароль*" value={formData.password} onChange={handleChange} error={errors.password} />
          {formData.password && (
            <Input autoComplete="new-password" name='password_confirmation' type="password" placeholder="Подтвердите пароль*" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
          )}
          <Textarea name='bio' placeholder='Введите описание профиля' value={formData.bio} onChange={handleChange} error={errors.bio} />
          <div className={styles.buttonContainer}>
            <Button type="submit">{loading.save ? <Loader /> : 'Сохранить изменения'}</Button>
            <Button onClick={handleLogout}>{loading.logout ? <Loader /> : 'Выйти'}</Button>
            <Button onClick={() => setModal({ type: 'confirmDelete' })} className={styles.deleteBtn}>{loading.delete ? <Loader /> : 'Удалить аккаунт'}</Button>
          </div>
        </Form>
      )}
    </div>
    {modal?.type === 'confirmDelete' && (
      <Modal
        onClose={() => {
          setModal(prev => ({ ...prev, close: true }));
          setTimeout(() => setModal(null), 400);
        }}
        childrenData={[
          { name: 'Подтвердить', onClick: handleDelete },
          { name: 'Отмена', onClick: () => { }, closeAfterClick: true }
        ]}
      >
        <p>Вы уверены, что хотите удалить аккаунт? Это&nbsp;действие безвозвратное.</p>
      </Modal>
    )}

    {modal?.type === 'deleted' && (
      <Modal
        onClose={() => {
          localStorage.clear();
          navigate('/login');
        }}
        childrenData={[
          {
            name: 'ОК',
            onClick: () => {
              localStorage.clear();
              navigate('/login');
            }
          }
        ]}
      >
        <p>Аккаунт удалён</p>
      </Modal>
    )}
  </>
  );
}

export default ProfilePage;