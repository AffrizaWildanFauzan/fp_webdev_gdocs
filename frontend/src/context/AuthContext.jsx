import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';  // ← PAKAI API.JS!
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');  // ← PAKAI API.JS!
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });  // ← PAKAI API.JS!
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);  // ← PAKAI API.JS!
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAgent: user?.role === 'agent' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};