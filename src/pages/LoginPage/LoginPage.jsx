import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './LoginPage.module.css';
import Container from '../../components/common/Container/Container';
import Input from '../../components/common/Input/Input';
import Loader from '../../components/common/Loader/Loader';
import Form from '../../components/common/Form/Form';
import Button from '../../components/common/Button/Button';
import client from '../../api/client';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  }

  const login = async (formData) => {
    setIsLoading(true);
    try {
      const response = await client('/auth/login', { body: formData });
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role.name);
        navigate('/');
      } else {
        throw response;
      }
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const formatted = {};
        Object.entries(error.errors).forEach(([field, message]) => {
          formatted[field] = message.join(', ');
        });
        setErrors(formatted);
      } else if (error.status === 401) {
        setErrors({ common: error.errors?.[0] || error.message || 'Ошибка входа' });
      }
      else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return <div className={styles.formContainer}>
    <Container>
      <div className={styles.formHeaderContainer}>
        <h1 className={styles.currentPage}>Вход</h1>
        <Link to='/register'>Регистрация</Link>
      </div>
      <Form onSubmit={handleSubmit}>
        <Input autoComplete="username" required name='email' type="email" placeholder="Введите email*" value={formData.email} onChange={handleChange} error={errors.email} />
        <Input autoComplete="password" required name='password' type="password" placeholder="Введите пароль*" value={formData.password} onChange={handleChange} error={errors.password} />
        {errors.common && <span data-testid={`common-error`} className={styles.errorText}>{errors.common}</span>}
        <Button type="submit">{loading ? <Loader /> : 'Войти'}</Button>
      </Form>
    </Container>
  </div>
};

export default LoginPage;