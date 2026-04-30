import { useState, useEffect } from 'react';
import { emotionsApi } from '../api/emotions';

export const useEmotionChart = () => {
  const [emotions, setEmotions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [emoData, logsData] = await Promise.all([
        emotionsApi.getEmotions(),
        emotionsApi.getAllLogs()
      ]);
      setEmotions(emoData);
      setLogs(logsData);
      setFilteredLogs(logsData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addLog = async (id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await emotionsApi.createLog(id);
      const updatedLogs = await emotionsApi.getAllLogs();
      setLogs(updatedLogs);
      setFilteredLogs(updatedLogs);
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  const filterLogs = (days) => {
    if (!days) return setFilteredLogs(logs);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    setFilteredLogs(logs.filter(log => new Date(log.created_at) >= startDate));
  };

  return { emotions, logs: filteredLogs, isLoading, addLog, filterLogs };
};