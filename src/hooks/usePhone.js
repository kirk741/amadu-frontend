import { useState, useEffect } from 'react';
import { supportApi } from '../api/support';

export const usePhone = (id) => {
  const [phone, setPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhone = async () => {
    try {
      setIsLoading(true);
      const data = await supportApi.getPhone(id);
      setPhone(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPhone();
  }, [id]);

  return { phone, isLoading, refresh: fetchPhone };
};
