import { create } from 'zustand';

interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  compatibility_data: {
    compatibility_score: number;
    element_harmony_score: number;
    day_master_synergy: number;
    strength_gap: number;
    yearly_prediction: string;
    recommendations: string[];
  };
  created_at: string;
}

interface CoupleState {
  couple: Couple | null;
  compatibility: any | null;
  isLoading: boolean;
  error: string | null;
  setCouple: (couple: Couple) => void;
  setCompatibility: (compatibility: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  couple: null,
  compatibility: null,
  isLoading: false,
  error: null,
  setCouple: (couple) => set({ couple }),
  setCompatibility: (compatibility) => set({ compatibility }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ couple: null, compatibility: null }),
}));
