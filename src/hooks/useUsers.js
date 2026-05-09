import { useState, useEffect } from 'react';
import { usersApi } from '../api/users';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async (page = 1, search = searchQuery) => {
    try {
      setIsLoading(true);
      const result = await usersApi.getPsychologists(page, search);
      setUsers(result.data || []);
      setPagination({
        current: result.current_page,
        last: result.last_page
      });
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchUsers(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return {
    users,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    refresh: fetchUsers
  };
};
