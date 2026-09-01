import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('endor_auth_token');
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Token expired or invalid", err);
          localStorage.removeItem('endor_auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (username, email, password) => {
    setError(null);
    try {
      const data = await authApi.signup(username, email, password);
      localStorage.setItem('endor_auth_token', data.access_token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Signup failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const data = await authApi.login(username, password);
      localStorage.setItem('endor_auth_token', data.access_token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Invalid credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('endor_auth_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
