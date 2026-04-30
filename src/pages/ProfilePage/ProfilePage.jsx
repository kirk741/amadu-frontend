import { useEffect, useState } from "react";
import Input from "../../components/ui/Input/Input";
import styles from "./ProfilePage.module.css";
import Form from "../../components/ui/Form/Form";
import Button from "../../components/ui/Button/Button";
import Textarea from "../../components/ui/Textarea/Textarea";
import FileInput from "../../components/ui/FileInput/FileInput";
import Modal from "../../components/ui/Modal/Modal";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import Loader from "../../components/ui/Loader/Loader";
import { useProfile } from "../../hooks/useProfile";
import ProfileSkeleton from "./ProfileSkeleton/ProfileSkeleton";

const ProfilePage = () => {
  const { formData, setFormData, errors, loading, saveProfile, logout, deleteMe } = useProfile();
  const [modal, setModal] = useState(null);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  if (loading.get) return <ProfileSkeleton />;

  return (
    <div className={styles.formContainer}>
      <Form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
        <FileInput
          name="avatar"
          label='Нажмите для изменения фото'
          initialPreview={formData.avatar}
          onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))}
          error={errors.avatar}
        />
        <Input name='name' placeholder="Имя*" value={formData.name} onChange={handleChange} error={errors.name} />
        <Input name='email' type="email" placeholder="Email*" value={formData.email} onChange={handleChange} error={errors.email} />
        <Input name='password' type="password" placeholder="Новый пароль" value={formData.password} onChange={handleChange} error={errors.password} />
        {formData.password && (
          <Input name='password_confirmation' type="password" placeholder="Подтвердите пароль" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
        )}
        <Textarea name='bio' placeholder='Описание профиля' value={formData.bio} onChange={handleChange} error={errors.bio} />

        <div className={styles.buttonContainer}>
          <Button type="submit">{loading.save ? <Loader /> : 'Сохранить'}</Button>
          <Button onClick={logout}>Выйти</Button>
          <Button onClick={() => setModal('confirmDelete')} className={styles.deleteBtn}>Удалить аккаунт</Button>
        </div>
      </Form>

      {modal === 'confirmDelete' && (
        <Modal
          onClose={() => setModal(null)}
          childrenData={[
            { name: 'Подтвердить', onClick: async () => { await deleteMe(); logout(); } },
            { name: 'Отмена', onClick: () => setModal(null) }
          ]}
        >
          Удалить аккаунт навсегда?
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;