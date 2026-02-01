import { create } from 'zustand';

interface Buff {
  id: string;
  couple_id: string;
  buff_type: string;
  effect_description: string;
  starts_at: string;
  expires_at: string;
}

interface BuffState {
  activeBuffs: Buff[];
  buffHistory: Buff[];
  isLoading: boolean;
  error: string | null;
  setActiveBuffs: (buffs: Buff[]) => void;
  setBuffHistory: (history: Buff[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useBuffStore = create<BuffState>((set) => ({
  activeBuffs: [],
  buffHistory: [],
  isLoading: false,
  error: null,
  setActiveBuffs: (buffs) => set({ activeBuffs: buffs }),
  setBuffHistory: (history) => set({ buffHistory: history }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ activeBuffs: [], buffHistory: [] }),
}));
