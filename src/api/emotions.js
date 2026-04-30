import { formatToDB } from "../utils/formatDate";
import client from "./client";

export const emotionsApi = {
  getLogs: (page = 1, search = '') =>
    client(`/emotion-logs?page=${page}&search=${search}`).then(res => res.data),

  getEmotions: () => client('/emotions').then(res => res.data),

  deleteLog: (id) => client(`/emotion-logs/${id}`, { method: 'DELETE' }),

  updateLog: (id, emotionId, date) => {
    const formData = new FormData();
    formData.append('emotion_id', emotionId);
    formData.append('created_at', date);
    formData.append('_method', 'PATCH');

    return client(`/emotion-logs/${id}`, { method: 'POST', body: formData });
  },

  getAllLogs: async () => {
    let currentPage = 1;
    let lastPage = 1;
    let allLogs = [];

    while (lastPage >= currentPage) {
      const response = await client(`/emotion-logs?page=${currentPage}`);
      allLogs = [...allLogs, ...response.data.data];
      lastPage = response.data.last_page;
      currentPage++;
    }
    return allLogs;
  },

  createLog: (id) => client('/emotion-logs', {
    body: {
      emotion_id: id,
      created_at: formatToDB(new Date())
    }
  })
};
