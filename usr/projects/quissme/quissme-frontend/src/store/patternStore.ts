import { create } from 'zustand';

interface Pattern {
  id: string;
  couple_id: string;
  pattern_type: string;
  confidence: number;
  triggered_at: string;
  intervention_sent?: string;
  user_response?: string;
}

interface PatternState {
  patterns: Pattern[];
  analysis: any | null;
  isLoading: boolean;
  error: string | null;
  setPatterns: (patterns: Pattern[]) => void;
  setAnalysis: (analysis: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const usePatternStore = create<PatternState>((set) => ({
  patterns: [],
  analysis: null,
  isLoading: false,
  error: null,
  setPatterns: (patterns) => set({ patterns }),
  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ patterns: [], analysis: null }),
}));
