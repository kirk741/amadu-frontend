import { useState, useEffect, useRef } from 'react';
import client from '../api/client';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await client('/conversations');
      setConversations(res.data || res || []);
    } catch (e) {
      console.error("Ошибка загрузки списка чатов:", e);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
    intervalRef.current = setInterval(() => {
      fetchConversations(false);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return { conversations, isLoading };
};
