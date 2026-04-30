import Container from "../../../components/ui/Container/Container";
import Input from "../../../components/ui/Input/Input";
import styles from "./RegisterPage.module.css";
import Form from "../../../components/ui/Form/Form";
import Button from "../../../components/ui/Button/Button";
import Textarea from "../../../components/ui/Textarea/Textarea";
import FileInput from "../../../components/ui/FileInput/FileInput";
import { Link } from "react-router-dom";
import Loader from "../../../components/ui/Loader/Loader";
import { useRegister } from "../../../hooks/useRegister";

const RegisterPage = () => {
  const { formData, setFormData, handleChange, register, loading, errors } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className={styles.formContainer}>
      <Container>
        <div className={styles.formHeaderContainer}>
          <h1 className={styles.currentPage}>Регистрация</h1>
          <Link to='/login'>Вход</Link>
        </div>

        <Form onSubmit={handleSubmit}>
          <Input name='name' placeholder="Ваше имя*" value={formData.name} onChange={handleChange} error={errors.name} />
          <Input name='email' type="email" placeholder="Email*" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input name='password' type="password" placeholder="Пароль*" value={formData.password} onChange={handleChange} error={errors.password} />
          <Input name='password_confirmation' type="password" placeholder="Повторите пароль*" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />

          <Textarea name='bio' placeholder='Описание профиля' value={formData.bio} onChange={handleChange} error={errors.bio} />

          <FileInput
            name='avatar'
            label='Загрузите фото профиля'
            onChange={(file) => setFormData(prev => ({ ...prev, avatar: file }))}
            error={errors.avatar}
          />

          <Button type="submit">
            {loading ? <Loader /> : 'Зарегистрироваться'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default RegisterPage;