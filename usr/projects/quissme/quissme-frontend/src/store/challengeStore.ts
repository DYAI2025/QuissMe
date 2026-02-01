import { create } from 'zustand';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  buff_reward?: string;
}

interface ChallengeHistory {
  id: string;
  couple_id: string;
  challenge_id: string;
  status: 'offered' | 'started' | 'completed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  feedback_rating?: number;
}

interface ChallengeState {
  recommended: Challenge[];
  active: ChallengeHistory[];
  completed: ChallengeHistory[];
  isLoading: boolean;
  error: string | null;
  setRecommended: (challenges: Challenge[]) => void;
  setActive: (challenges: ChallengeHistory[]) => void;
  setCompleted: (challenges: ChallengeHistory[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  recommended: [],
  active: [],
  completed: [],
  isLoading: false,
  error: null,
  setRecommended: (challenges) => set({ recommended: challenges }),
  setActive: (challenges) => set({ active: challenges }),
  setCompleted: (challenges) => set({ completed: challenges }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ recommended: [], active: [], completed: [] }),
}));
