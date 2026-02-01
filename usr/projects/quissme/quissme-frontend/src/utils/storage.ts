import config from '../config/config';

export const storage = {
  setToken: (token: string) => {
    localStorage.setItem(config.storage.tokenKey, token);
  },
  getToken: (): string | null => {
    return localStorage.getItem(config.storage.tokenKey);
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem(config.storage.refreshTokenKey, token);
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem(config.storage.refreshTokenKey);
  },
  setUser: (user: any) => {
    localStorage.setItem(config.storage.userKey, JSON.stringify(user));
  },
  getUser: (): any | null => {
    const user = localStorage.getItem(config.storage.userKey);
    return user ? JSON.parse(user) : null;
  },
  clearTokens: () => {
    localStorage.removeItem(config.storage.tokenKey);
    localStorage.removeItem(config.storage.refreshTokenKey);
  },
  clearAll: () => {
    localStorage.removeItem(config.storage.tokenKey);
    localStorage.removeItem(config.storage.refreshTokenKey);
    localStorage.removeItem(config.storage.userKey);
  },
};
