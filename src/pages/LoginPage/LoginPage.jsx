import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import Form from '../../components/common/Form/Form';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const LoginPage = () => {
  return <div className={styles.centeredContainer}>
    <div className={styles.titleContainer}>
      <span className={styles.title}>Вход</span>
      <Link to='/register' className="link">Регистрация</Link>
    </div>
    <Form>
      <Input type="email" placeholder='Введите email*' required />
      <Input type="password" placeholder='Введите пароль*' required />
      <Button>
        Войти
      </Button>
    </Form>
  </div>
}

export default LoginPage;