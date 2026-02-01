import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../api/hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  const { refreshToken } = useAuth();

  useEffect(() => {
    // Try to refresh token on mount
    const initAuth = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    };
    initAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated: !!user,
    isLoading,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
