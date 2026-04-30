import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import Container from '../../../components/ui/Container/Container';
import Input from '../../../components/ui/Input/Input';
import Loader from '../../../components/ui/Loader/Loader';
import Form from '../../../components/ui/Form/Form';
import Button from '../../../components/ui/Button/Button';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
  const { formData, handleChange, login, loading, errors } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className={styles.formContainer}>
      <Container>
        <div className={styles.formHeaderContainer}>
          <h1 className={styles.currentPage}>Вход</h1>
          <Link to='/register'>Регистрация</Link>
        </div>

        <Form onSubmit={handleSubmit}>
          <Input
            autoComplete="username"
            name='email'
            type="email"
            placeholder="Введите email*"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            autoComplete="current-password"
            name='password'
            type="password"
            placeholder="Введите пароль*"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {errors.common && <span className={styles.errorText}>{errors.common}</span>}

          <Button type="submit">
            {loading ? <Loader /> : 'Войти'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default LoginPage;