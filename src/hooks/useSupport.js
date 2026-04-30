import { useState, useEffect } from 'react';
import { supportApi } from '../api/support';

export const useSupport = () => {
  const [phones, setPhones] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPhones = async (page = 1, search = searchQuery) => {
    try {
      setIsLoading(true);
      const result = await supportApi.getPhones(page, search);
      
      setPhones(result.data || []);
      setPagination({
        current: result.current_page,
        last: result.last_page
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPhones(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return { 
    phones, 
    pagination, 
    isLoading, 
    searchQuery, 
    setSearchQuery, 
    refresh: fetchPhones 
  };
};