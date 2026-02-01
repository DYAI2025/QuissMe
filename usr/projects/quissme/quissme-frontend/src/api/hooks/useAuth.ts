import { useState } from 'react';
import apiClient from '../client';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../utils/storage';
import config from '../../config/config';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setAuthenticated, setError } = useAuthStore();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.login, {
        email,
        password,
      });
      const { access_token, refresh_token, user } = response.data;
      storage.setToken(access_token);
      storage.setRefreshToken(refresh_token);
      storage.setUser(user);
      setUser(user);
      setAuthenticated(true);
      setError(null);
      return { success: true, user };
    } catch (error: any) {
      const message = error.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.register, {
        email,
        password,
        name,
      });
      const { access_token, refresh_token, user } = response.data;
      storage.setToken(access_token);
      storage.setRefreshToken(refresh_token);
      storage.setUser(user);
      setUser(user);
      setAuthenticated(true);
      setError(null);
      return { success: true, user };
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.clearAll();
    setUser(null);
    setAuthenticated(false);
  };

  return { login, register, logout, isLoading };
};
