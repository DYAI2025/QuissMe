import { useState } from 'react';
import apiClient from '../client';
import { useQuizStore } from '../../store/quizStore';
import config from '../../config/config';

export const useQuizzes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setQuizzes, setCurrentQuiz, setAttempts, setError } = useQuizStore();

  const listQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.listQuizzes);
      setQuizzes(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch quizzes';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuiz = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getQuiz(id));
      setCurrentQuiz(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch quiz';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuiz = async (quizId: string, answers: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(config.api.endpoints.submitQuiz, {
        quiz_id: quizId,
        answers,
      });
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to submit quiz';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getHistory = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(config.api.endpoints.getQuizHistory);
      setAttempts(response.data);
      setError(null);
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch history';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { listQuizzes, getQuiz, submitQuiz, getHistory, isLoading };
};
