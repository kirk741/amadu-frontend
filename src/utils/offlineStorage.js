export const getOfflineLogs = () => {
  const logs = localStorage.getItem('offline_emotion_logs');
  return logs ? JSON.parse(logs) : [];
};

export const saveOfflineLog = (log) => {
  const logs = getOfflineLogs();
  logs.push(log);
  localStorage.setItem('offline_emotion_logs', JSON.stringify(logs));
};

export const clearOfflineLogs = () => {
  localStorage.removeItem('offline_emotion_logs');
};

export const syncOfflineLogs = async (client) => {
  const offlineLogs = getOfflineLogs();
  if (offlineLogs.length === 0) return;
  for (const log of offlineLogs) {
    try {
      await client('/emotion-logs', {
        method: 'POST',
        body: {
          emotion_id: log.emotion_id,
          created_at: log.created_at,
        },
      });
    } catch (error) {
      console.error('Error syncing offline log:', error);
    }
  }
  clearOfflineLogs();
};