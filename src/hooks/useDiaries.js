import { useState, useEffect } from 'react';
import { diariesApi } from '../api/diaries';

export const useDiaries = () => {
  const [diaries, setDiaries] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDiaries = async (page = 1, search = searchQuery) => {
    try {
      setIsLoading(true);
      const data = await diariesApi.getAll(page, search);
      setDiaries(data.data);
      setPagination({ current: data.current_page, last: data.last_page });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchDiaries(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const removeDiary = async (diary, force = false) => {
    await diariesApi.delete(diary.type, diary.id, force);
    await fetchDiaries(pagination.current);
  };

  return {
    diaries,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    removeDiary,
    refresh: fetchDiaries,
    getImageUrl: diariesApi.getFileUrl
  };
}