const BASE_URL = 'http://ababkova.xn--80ahdri7a.site';


const client = async (endpoint, { customHeaders, method, body, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');
  const isFormData = body && (body instanceof FormData);

  const headers = {
    'Accept': 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };

  const config = {
    headers,
    method: method || (body ? 'POST' : 'GET'),
    body: (body && !isFormData) ? JSON.stringify(body) : body,
    ...customConfig
  };

  //const url = `${BASE_URL}${endpoint}`;
  const url = `${endpoint}`;

  try {
    const response = await window.fetch(url, config);

    const data = await response.json();

    if (response.status === 403 && localStorage.getItem('role') !== 'guest') {
      window.location.assign('/forbidden');
      return;
    }

    if (response.status === 401) {
      if (token) {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.assign('/login');
      }
      return Promise.reject(data);
    }

    if (response.status === 204) return true;

    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export default client;