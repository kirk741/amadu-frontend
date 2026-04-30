import client from "./client";

export const authApi = {
  login: async (credentials) => {
    const response = await client('/auth/login', { body: credentials });
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role.name);

      const theme = response.data.user.settings.theme;
      localStorage.setItem('theme', theme || '');
      document.documentElement.className = theme; 
    }
    return response;
  },

  register: async (formData) => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    const response = await client('/auth/register', { body: data });

    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role.name);
    }
    return response;
  }
};
