import axios from 'axios';
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'dt_token';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLogin && typeof window !== 'undefined') {
      Cookies.remove(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setToken = (token) =>
  Cookies.set(TOKEN_KEY, token, { expires: 1, sameSite: 'lax', secure: typeof window !== 'undefined' && window.location.protocol === 'https:' });
export const clearToken = () => Cookies.remove(TOKEN_KEY);

/** Remove empty params so URLs stay clean and the API receives only real filters. */
export const clean = (params = {}) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
export const getJson = (url, params) => api.get(url, { params: clean(params) }).then((r) => r.data);

export const errorMessage = (e) => e?.response?.data?.message || (e?.request ? 'Cannot reach the server. Check your connection and try again.' : e?.message || 'Something went wrong');
export const fieldErrors = (e) => e?.response?.data?.details || {};

export default api;
