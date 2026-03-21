import { Link } from "react-router-dom";
import Input from "../../components/common/Input/Input";
import styles from "./RegisterPage.module.css";
import Textarea from "../../components/common/Textarea/Textarea";
import Button from "../../components/common/Button/Button";
import FileInput from "../../components/common/FileInput/FileInput";
import Form from "../../components/common/Form/Form";
import client from '../../api/client';
import { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    birth_date: '',
    bio: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      const response = await client('/auth/register', { method: 'POST', body: data });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user?.role || 'user');
        window.location.assign('/');
      }
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }
    }
  }

  return <div className={styles.centeredContainer}>
    <div className={styles.titleContainer}>
      <span className={styles.title}>Регистрация</span>
      <Link to='/login' className="link">Вход</Link>
    </div>
    <Form onSubmit={handleSubmit}>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder='Введите ваше имя*'
        required
        error={errors.name?.[0]}
      />

      <Input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder='Введите email*'
        required
        error={errors.email?.[0]}
      />

      <Input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder='Введите пароль*'
        required
        error={errors.password?.[0]}
      />

      <Input
        name="password_confirmation"
        type="password"
        value={formData.password_confirmation}
        onChange={handleChange}
        placeholder='Подтвердите пароль*'
        required
      />

      <Input
        name="birth_date"
        type="date"
        value={formData.birth_date}
        onChange={handleChange}
        placeholder='Введите дату рождения'
        error={errors.birth_date?.[0]}
      />
      <div className={styles.inputContainer}>
        <span>Загрузите фото профиля</span>
        <FileInput onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))} />
      </div>

      <Textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder='Введите описание профиля'
        error={errors.bio?.[0]}
      />

      <Button type="submit">Зарегистрироваться</Button>
    </Form>
  </div>
}

export default RegisterPage;