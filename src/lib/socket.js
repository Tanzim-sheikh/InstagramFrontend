import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (socket) return socket;
  const fromEnv = import.meta.env.VITE_SOCKET_URL;
  const origin = fromEnv
    || (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '');
  if (!origin) return null; // no socket server configured in prod
  socket = io(origin, { withCredentials: true, autoConnect: true });
  return socket;
};

export const registerSocketUser = (userId) => {
  const s = getSocket();
  if (s && userId) s.emit('register', { userId });
};
