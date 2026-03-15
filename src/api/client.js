BASE_URL = 'https://ababkova.xn--80ahdri7a.site/';

export const client = async (endpoint, { customHeaders, method, body, ...customConfig }) => {
  const token = localStorage.getItem('token');
  const isFormData = body && (body instanceof FormData);

  const headers = {
    'Accept': 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders,
  }

  const config = {
    method: (body ? 'POST' : 'GET'),
    ...customConfig,
    headers,
    ...(body ? (isFormData ? { body: body } : { body: JSON.stringify(body) }) : {}),
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await window.fetch(url, config);
    
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
      return;
    }

    if (response.status === 204) return true;

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}