export const QUIZ_CATEGORIES = [
  { id: 'love-languages', name: 'Liebesprachen', icon: '💕' },
  { id: 'conflict', name: 'Konflikt-Muster', icon: '⚡' },
  { id: 'intimacy', name: 'Intimität', icon: '🔥' },
  { id: 'values', name: 'Werte', icon: '🎯' },
  { id: 'daily', name: 'Alltag', icon: '☀️' },
  { id: 'trust', name: 'Vertrauen', icon: '🤝' },
  { id: 'future', name: 'Zukunft', icon: '🚀' },
  { id: 'sensuality', name: 'Sinnlichkeit', icon: '✨' },
];

export const BUFF_TYPES = [
  { id: 'love-whisperer', name: 'Liebesflüsterer', duration: 7, effect: '+15% Empathie' },
  { id: 'harmony-wave', name: 'Harmonie-Welle', duration: 3, effect: '-Konflikte, +Geduld' },
  { id: 'reconciliation', name: 'Versöhnungs-Kraft', duration: 1, effect: 'Nach Streit: schneller Reset' },
  { id: 'curiosity', name: 'Neugier-Funkeln', duration: 7, effect: '+Fragen stellen' },
  { id: 'intimacy-boost', name: 'Intimitäts-Boost', duration: 7, effect: '+Körperliche Nähe' },
  { id: 'value-sharpener', name: 'Wert-Schärfer', duration: 14, effect: 'Klarere Prioritäten' },
];

export const CHALLENGE_TYPES = [
  { id: 'micro', name: 'Micro-Challenge', duration: '1-5 min' },
  { id: 'daily', name: 'Daily-Ritual', duration: '1 Woche' },
  { id: 'deep', name: 'Deep-Dive', duration: '24h' },
  { id: 'plus18', name: '+18 Challenge', duration: 'Variabel' },
];

export const PATTERN_TYPES = [
  { id: 'intimacy-drop', name: 'Intimitäts-Drop', icon: '📉' },
  { id: 'conflict-escalation', name: 'Konflikt-Eskalation', icon: '🔥' },
  { id: 'routine-complacency', name: 'Routine-Trägheit', icon: '😴' },
  { id: 'communication-gap', name: 'Kommunikations-Lücke', icon: '🤐' },
  { id: 'trust-erosion', name: 'Vertrauens-Erosion', icon: '⚠️' },
];

export const SCORE_RANGES = {
  excellent: { min: 80, label: 'Ausgezeichnet', color: '#D6B25E' },
  good: { min: 60, label: 'Gut', color: '#4ADE80' },
  fair: { min: 40, label: 'Befriedigend', color: '#FBBF24' },
  poor: { min: 0, label: 'Verbesserungsbedürftig', color: '#EF4444' },
};

export const ROUTES = {
  public: {
    login: '/login',
    register: '/register',
    birthData: '/birth-data',
  },
  protected: {
    home: '/home',
    quiz: '/quiz',
    couple: '/couple',
    challenges: '/challenges',
    patterns: '/patterns',
    profile: '/profile',
  },
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Ungültige E-Mail-Adresse',
  INVALID_PASSWORD: 'Passwort muss mindestens 8 Zeichen lang sein',
  INVALID_NAME: 'Name muss mindestens 2 Zeichen lang sein',
  INVALID_BIRTH_DATE: 'Ungültiges Geburtsdatum',
  INVALID_BIRTH_TIME: 'Ungültige Geburtszeit',
  INVALID_LOCATION: 'Ungültiger Ort',
  NETWORK_ERROR: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.',
  UNAUTHORIZED: 'Authentifizierung erforderlich',
  FORBIDDEN: 'Zugriff verweigert',
  NOT_FOUND: 'Nicht gefunden',
  SERVER_ERROR: 'Serverfehler. Bitte versuchen Sie es später erneut.',
};
