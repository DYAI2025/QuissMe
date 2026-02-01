import { useState } from 'react';
import apiClient from '../client';
import { useBuffStore } from '../../store/buffStore';
import config from '../../config/config';

export const useBuffs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setActiveBuffs, setBuffHistory, setError } = useBuffStore();

  const getActiveBuffs = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getActiveBuffs);
      setActiveBuffs(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch active buffs';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getHistory = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getBuffHistory);
      setBuffHistory(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch buff history';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getActiveBuffs, getHistory, isLoading };
};
