import { useState } from 'react';
import apiClient from '../client';
import { usePatternStore } from '../../store/patternStore';
import config from '../../config/config';

export const usePatterns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPatterns, setAnalysis, setError } = usePatternStore();

  const getPatterns = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getPatterns);
      setPatterns(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch patterns';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePatterns = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.analyzePatterns);
      setAnalysis(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to analyze patterns';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getPatterns, analyzePatterns, isLoading };
};
