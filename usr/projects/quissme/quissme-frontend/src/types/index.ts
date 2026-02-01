// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  birthData: BirthData;
  createdAt: Date;
}

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  location: string;
}

export interface Couple {
  id: string;
  user1Id: string;
  user2Id: string;
  compatibilityScore: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface QuizAttempt {
  id: string;
  coupleId: string;
  quizType: string;
  answers: Record<string, any>;
  score: number;
  insights: string;
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}
