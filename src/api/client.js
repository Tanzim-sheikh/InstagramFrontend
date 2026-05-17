import axios from 'axios';

const publicRoutes = [
  '/user/login',
  '/user/signup',
  '/user/verify-email',
  '/user/resend-otp',
  '/user/forgot-password',
  '/user/reset-password',
];

const api = axios.create({
  // baseURL: 'https://your-nexachat-backend.example.com/api',
  baseURL: 'https://instagram-backend-five-iota.vercel.app/api',
});

api.interceptors.request.use((config) => {
  const path = config.url || '';
  const isPublicRoute = publicRoutes.some((route) => path.includes(route));
  const token = localStorage.getItem('token');
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
