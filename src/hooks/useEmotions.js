import { useEffect, useState } from "react";
import { emotionsApi } from "../api/emotions";

export const useEmotions = () => {
  const [logs, setLogs] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async (page = 1, search = searchQuery) => {
    try {
      setIsLoading(true);
      const data = await emotionsApi.getLogs(page, search);
      setLogs(data.data || []);
      setPagination({ current: data.current_page, last: data.last_page });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(1, searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    emotionsApi.getEmotions().then(setEmotions);
  }, []);

  const removeLog = async (id) => {
    await emotionsApi.deleteLog(id);
    await fetchLogs();
  };

  const updateLog = async (id, emotionId, date) => {
    await emotionsApi.updateLog(id, emotionId, date);
    await fetchLogs();
  };

  return {
    logs, emotions, pagination, isLoading,
    searchQuery, setSearchQuery,
    refresh: fetchLogs,
    removeLog,
    updateLog 
  };
};