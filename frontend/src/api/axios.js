import axios from 'axios';
import store from '../store';
import { logout, setAccessToken } from '../store/authSlice';

const API = axios.create({ baseURL: process.env.REACT_APP_API || 'http://localhost:8000/api' });

// request interceptor
API.interceptors.request.use((config) => {
  const state = store.getState();
  let token = state.auth?.accessToken;
  if (!token && typeof window !== 'undefined') token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor
API.interceptors.response.use((res) => res, async (err) => {
  const original = err.config;
  if (err.response && err.response.status === 401 && !original._retry) {
    original._retry = true;
    try {
      const r = await axios.post((process.env.REACT_APP_API || 'http://localhost:8000') + '/api/auth/refresh-token', {}, { withCredentials: true });
      const accessToken = r.data?.data?.accessToken;
      if (accessToken) {
        store.dispatch(setAccessToken(accessToken));
        original.headers.Authorization = `Bearer ${accessToken}`;
        return axios(original);
      }
    } catch (e) {
      store.dispatch(logout());
      return Promise.reject(e);
    }
  }
  return Promise.reject(err);
});

export default API;
