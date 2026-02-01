import { create } from 'zustand';

interface Quiz {
  id: string;
  category: string;
  title: string;
  description: string;
  questions: any[];
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  couple_id: string;
  answers: any;
  score: number;
  insights: string;
  created_at: string;
}

interface QuizState {
  currentQuiz: Quiz | null;
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  isLoading: boolean;
  error: string | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  setAttempts: (attempts: QuizAttempt[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  quizzes: [],
  attempts: [],
  isLoading: false,
  error: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setQuizzes: (quizzes) => set({ quizzes }),
  setAttempts: (attempts) => set({ attempts }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ currentQuiz: null, quizzes: [], attempts: [] }),
}));
