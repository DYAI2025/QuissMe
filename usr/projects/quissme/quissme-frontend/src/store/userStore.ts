import { create } from 'zustand';

interface BirthData {
  date: string;
  time: string;
  location: string;
}

interface UserState {
  profile: any | null;
  birthData: BirthData | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: any) => void;
  setBirthData: (birthData: BirthData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  birthData: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setBirthData: (birthData) => set({ birthData }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clear: () => set({ profile: null, birthData: null }),
}));
