import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '', bio: '', avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const register = async () => {
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.register(formData);
      if (res.success) return navigate('/');
      throw res;
    } catch (error) {
      if (error.status === 422) {
        const formatted = {};
        Object.entries(error.errors || {}).forEach(([field, messages]) => {
          formatted[field] = messages.join(', ');
        });
        setErrors(formatted);
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleChange, register, loading, errors };
};