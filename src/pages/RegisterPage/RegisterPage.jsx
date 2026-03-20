import { Link } from "react-router-dom";
import Container from "../../components/common/Container/Container";
import Input from "../../components/common/Input/Input";
import styles from "./RegisterPage.module.css";
import Textarea from "../../components/common/Textarea/Textarea";
import Button from "../../components/common/Button/Button";
import FileInput from "../../components/common/FileInput/FileInput";
import Form from "../../components/common/Form/Form";

const RegisterPage = () => {
  return <div className={styles.centeredContainer}>
    <div className={styles.titleContainer}>
      <span className={styles.title}>Регистрация</span>
      <Link to='/login' className="link">Вход</Link>
    </div>
    <Form>
      <Input placeholder='Введите ваше имя*' required pattern='^[A-Za-zА-ЯЁа-яё \-]+$' />
      <Input type="email" placeholder='Введите email*' required />
      <Input type="password" placeholder='Введите пароль*' required />
      <Input type="password" placeholder='Подтвердите пароль*' required />
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="birthDate">Введите дату рождения</label>
        <Input name="birthDate" type="date" placeholder='' />
      </div>
      <Textarea placeholder='Введите описание профиля' />
      <FileInput />
      <Button>
        Зарегистрироваться
      </Button>
    </Form>
  </div>
}

export default RegisterPage;