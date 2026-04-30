import { useState, useEffect } from 'react';
import { usersApi } from '../api/users';

export const useUser = (id) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.getUser(id);
      setUser(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  return { user, isLoading, refresh: fetchUser };
};
