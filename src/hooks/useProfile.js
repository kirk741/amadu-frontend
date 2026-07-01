import { useState, useEffect } from 'react';
import { userApi } from '../api/user';
import { useNavigate } from 'react-router-dom';

export const useProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '', bio: '', avatar: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({ get: true, save: false });

  const fetchProfile = async () => {
    try {
      setLoading(prev => ({ ...prev, get: true }));
      const data = await userApi.getMe();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        avatar: data.media?.[0]?.file_path ? `${process.env.REACT_APP_API_URL}/storage/${data.media[0].file_path}` : null,
        password: '',
        password_confirmation: ''
      });
    } catch (e) { console.error(e); }
    finally { setLoading(prev => ({ ...prev, get: false })); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    setErrors({});

    try {
      const res = await userApi.updateMe(formData);
      if (!res.success) throw res;
      await fetchProfile();
    } catch (e) {
      if (e.errors) setErrors(e.errors);
    } finally { setLoading(prev => ({ ...prev, save: false })); }
  };

  const logout = async () => {
    try { await userApi.logout(); }
    finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  return { formData, setFormData, errors, loading, saveProfile, logout, deleteMe: userApi.deleteMe };
};