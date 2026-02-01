import { useState } from 'react';
import apiClient from '../client';
import { useUserStore } from '../../store/userStore';
import config from '../../config/config';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile, setBirthData, setError } = useUserStore();

  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getMe);
      setProfile(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch user';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put(config.api.endpoints.updateProfile, data);
      setProfile(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to update profile';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBirthData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getBirthData);
      setBirthData(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch birth data';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBirthData = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put(config.api.endpoints.updateBirthData, data);
      setBirthData(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to update birth data';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getUser, updateProfile, getBirthData, updateBirthData, isLoading };
};
