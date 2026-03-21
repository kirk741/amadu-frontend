import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './LoginPage.module.css';
import Form from '../../components/common/Form/Form';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import client from '../../api/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await client('/auth/login', {
        method: 'POST',
        body: formData
      });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user?.role || 'user');
        navigate('/');
      } else {
        setErrors({ general: ['Неверный email или пароль'] });
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors({ general: [error.message] });
      } else {
        setErrors({ general: ['Произошла ошибка при входе'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.centeredContainer}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>Вход</span>
        <Link to='/register' className="link">Регистрация</Link>
      </div>
      <Form onSubmit={handleSubmit}>
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
        {errors.general && <div className={styles.errorMessage}>{errors.general[0]}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;