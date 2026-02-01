// Configuration for QuissMe Frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

export const config = {
  api: {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    endpoints: {
      // Auth
      login: '/api/auth/login',
      register: '/api/auth/register',
      refresh: '/api/auth/refresh',
      logout: '/api/auth/logout',
      
      // Users
      getMe: '/api/users/me',
      updateProfile: '/api/users/me',
      getBirthData: '/api/users/me/birth-data',
      updateBirthData: '/api/users/me/birth-data',
      
      // Couples
      createCouple: '/api/couples',
      getCouple: '/api/couples/me',
      getCompatibility: '/api/couples/me/compatibility',
      
      // Quizzes
      listQuizzes: '/api/quizzes',
      getQuiz: (id: string) => `/api/quizzes/${id}`,
      submitQuiz: '/api/quizzes/submit',
      getQuizHistory: '/api/quizzes/history',
      
      // Buffs
      getActiveBuffs: '/api/buffs/active',
      getBuffHistory: '/api/buffs/history',
      
      // Challenges
      getRecommendedChallenges: '/api/challenges/recommended',
      startChallenge: '/api/challenges/start',
      completeChallenge: '/api/challenges/complete',
      getActiveChallenges: '/api/challenges/active',
      getCompletedChallenges: '/api/challenges/completed',
      
      // Patterns
      getPatterns: '/api/patterns',
      analyzePatterns: '/api/patterns/analyze',
    },
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'QuissMe',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  storage: {
    tokenKey: 'quissme_access_token',
    refreshTokenKey: 'quissme_refresh_token',
    userKey: 'quissme_user',
  },
  theme: {
    colors: {
      bg: '#05060A',
      gold: '#D6B25E',
      surface: 'rgba(255, 255, 255, 0.06)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
};

export default config;
