import { useState } from 'react';
import apiClient from '../client';
import { useCoupleStore } from '../../store/coupleStore';
import config from '../../config/config';

export const useCouple = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCouple, setCompatibility, setError } = useCoupleStore();

  const createCouple = async (partner_email: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.createCouple, {
        partner_email,
      });
      setCouple(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to create couple';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCouple = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getCouple);
      setCouple(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch couple';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCompatibility = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getCompatibility);
      setCompatibility(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch compatibility';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCouple, getCouple, getCompatibility, isLoading };
};
