import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { updateAuth } = useAuthContext();

  const login = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const res = await authApi.login(formData);
      if (res.success) {
        updateAuth(res.data.user.role.name, res.data.user.settings.theme);
        navigate('/');
        return;
      }
      throw res;
    } catch (error) {
      if (error.status === 422) {
        const formatted = {};
        Object.entries(error.errors).forEach(([field, msg]) => {
          formatted[field] = Array.isArray(msg) ? msg.join(', ') : msg;
        });
        setErrors(formatted);
      } else {
        setErrors({ common: error.errors?.[0] || 'Неверный логин или пароль' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, login, loading, errors };
};
