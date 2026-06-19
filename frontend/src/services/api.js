import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API || '' });

export const fetchProducts = () => API.get('/api/products');
export const fetchProduct = (id) => API.get(`/api/products/${id}`);

export default API;
