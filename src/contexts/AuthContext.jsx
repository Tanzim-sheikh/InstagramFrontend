import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await api.get('/user/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/user/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (formData) => {
    // formData is a FormData containing name, email, password, profilePhoto
    await api.post('/user/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const verifyEmail = async (email, otp) => {
    await api.post('/user/verify-email', { email, otp });
  };

  const forgotPassword = async (email) => {
    await api.post('/user/forgot-password', { email });
  };

  const resetPassword = async (email, otp, newPassword) => {
    await api.post('/user/reset-password', { email, otp, newPassword });
  };

  const resendOtp = async (email) => {
    await api.post('/user/resend-otp', { email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, verifyEmail, forgotPassword, resetPassword, resendOtp, logout, loadUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
