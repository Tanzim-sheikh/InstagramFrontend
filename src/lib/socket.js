import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (socket) return socket;
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const origin = apiBase.replace(/\/api$/, '');
  socket = io(origin, { withCredentials: true, autoConnect: true });
  return socket;
};

export const registerSocketUser = (userId) => {
  const s = getSocket();
  if (userId) s.emit('register', { userId });
};
