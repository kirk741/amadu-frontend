import client from "./client";

export const userApi = {
  getMe: () => client('/user/me').then(res => res.data),
  
  updateMe: (data) => {
    const form = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'avatar' && !(data[key] instanceof File)) return;
        form.append(key, data[key]);
      }
    });
    form.append('_method', 'PATCH');
    return client('/user/me', { body: form });
  },

  logout: () => client('/auth/logout', { method: 'POST' }),
  
  deleteMe: () => client('/user/me', { method: 'DELETE' })
};