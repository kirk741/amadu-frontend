import { useState, useEffect } from 'react';
import { diariesApi } from '../api/diaries';

export const useTrash = () => {
  const [diaries, setDiaries] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrash = async (page = 1, search = searchQuery) => {
    try {
      setIsLoading(true);
      const data = await diariesApi.getTrash(search);
      setDiaries(data.data || []);
      setPagination({ current: data.current_page, last: data.last_page });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTrash(1, searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const restoreDiary = async (diary) => {
    await diariesApi.restore(diary.type, diary.id);
    await fetchTrash();
  };

  const forceDelete = async (diary) => {
    await diariesApi.delete(diary.type, diary.id, true);
    await fetchTrash();
  };

  return { diaries, pagination, isLoading, searchQuery, setSearchQuery, restoreDiary, forceDelete, refresh: fetchTrash };
};
