import { useState } from "react";
import Container from "../../components/common/Container/Container";
import Input from "../../components/common/Input/Input";
import styles from "./RegisterPage.module.css";
import Form from "../../components/common/Form/Form";
import Button from "../../components/common/Button/Button";
import Textarea from "../../components/common/Textarea/Textarea";
import FileInput from "../../components/common/FileInput/FileInput";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import Loader from "../../components/common/Loader/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    bio: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          data.append(key, value);
        } else if (value) {
          data.append(key, value);
        }
      });

      const response = await client('/auth/register', { body: data });
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role.name)
        navigate('/');
      } else {
        throw response;
      }
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const formatted = {};
        Object.entries(error.errors).forEach(([field, messages]) => {
          formatted[field] = messages.join(', ');
        });
        setErrors(formatted);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  }

  return <div className={styles.formContainer}>
    <Container>
      <div className={styles.formHeaderContainer}>
        <h1 className={styles.currentPage}>Регистрация</h1>
        <Link to='/login'>Вход</Link>
      </div>
      <Form onSubmit={handleSubmit}>
        <Input required name='name' placeholder="Введите ваше имя*" value={formData.name} onChange={handleChange} error={errors.name} />
        <Input autoComplete="username" required name='email' type="email" placeholder="Введите email*" value={formData.email} onChange={handleChange} error={errors.email} />
        <Input autoComplete="new-password" required name='password' type="password" placeholder="Введите пароль*" value={formData.password} onChange={handleChange} error={errors.password} />
        <Input autoComplete="new-password" required name='password_confirmation' type="password" placeholder="Подтвердите пароль*" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
        <Textarea name='bio' placeholder='Введите описание профиля' value={formData.bio} onChange={handleChange} error={errors.bio} />
        <FileInput name='avatar' label='Загрузите фото профиля' onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))} error={errors.avatar} />
        <Button type="submit">{loading ? <Loader/> : 'Зарегистрироваться'}</Button>
      </Form>
    </Container>
  </div>
}

export default RegisterPage;