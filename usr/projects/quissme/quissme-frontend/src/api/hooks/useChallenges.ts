import { useState } from 'react';
import apiClient from '../client';
import { useChallengeStore } from '../../store/challengeStore';
import config from '../../config/config';

export const useChallenges = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRecommended, setActive, setCompleted, setError } = useChallengeStore();

  const getRecommended = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getRecommendedChallenges);
      setRecommended(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch recommended challenges';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startChallenge = async (challengeId: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.startChallenge, {
        challenge_id: challengeId,
      });
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to start challenge';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string, feedback?: number) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.completeChallenge, {
        challenge_id: challengeId,
        feedback_rating: feedback,
      });
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to complete challenge';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getActive = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getActiveChallenges);
      setActive(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch active challenges';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCompleted = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getCompletedChallenges);
      setCompleted(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch completed challenges';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getRecommended, startChallenge, completeChallenge, getActive, getCompleted, isLoading };
};
