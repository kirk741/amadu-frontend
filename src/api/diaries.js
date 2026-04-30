import client from "./client";

export const diariesApi = {
  getAll: (page = 1, search = '') =>
    client(`/all-diaries?page=${page}&search=${search}`).then(res => res.data),

  delete: (type, id, force = false) => {
    const endpoints = {
      feelings: 'feelings-diaries',
      personal: 'personal-diaries',
      food: 'food-diaries'
    };
    const endpoint = endpoints[type] || 'feelings-diaries';
    const url = `/${endpoint}/${id}${force ? '/force' : ''}`;
    return client(url, { method: 'DELETE' });
  },

  getFileUrl: (diary) => {
    if (diary.type === 'food' && diary.media?.length > 0) {
      const token = localStorage.getItem('token');
      return `${process.env.REACT_APP_API_URL}/food-diaries/${diary.id}/file?token=${token}`;
    }
    return null;
  },

  getTrash: (search = '') =>
    client(`/all-diaries/trash?search=${search}`).then(res => res.data),

  restore: (type, id) => {
    const endpoints = { feelings: 'feelings-diaries', personal: 'personal-diaries', food: 'food-diaries' };
    return client(`/${endpoints[type]}/${id}/restore`, { method: 'POST' });
  },

  create: (type, data) => {
    const endpoints = {
      'Дневник чувств': '/feelings-diaries',
      'Личный дневник': '/personal-diaries',
      'Дневник питания': '/food-diaries'
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    return client(endpoints[type], { body: formData });
  },

  getOne: (type, id) => {
    const endpoints = {
      'feelings': 'feelings-diaries',
      'personal': 'personal-diaries',
      'food': 'food-diaries'
    };
    return client(`/${endpoints[type]}/${id}`).then(res => res.data);
  },

  update: (type, id, data) => {
    const endpoints = {
      'feelings': 'feelings-diaries',
      'personal': 'personal-diaries',
      'food': 'food-diaries'
    };
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });
    formData.append('_method', 'PATCH');
    return client(`/${endpoints[type]}/${id}`, { body: formData });
  }
};
