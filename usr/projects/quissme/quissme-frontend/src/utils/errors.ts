import { ERROR_MESSAGES } from './constants';

export class QuissmeError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'QuissmeError';
  }
}

export const handleApiError = (error: any): string => {
  if (error.code === 'INVALID_EMAIL') return ERROR_MESSAGES.INVALID_EMAIL;
  if (error.code === 'INVALID_PASSWORD') return ERROR_MESSAGES.INVALID_PASSWORD;
  if (error.code === 'INVALID_NAME') return ERROR_MESSAGES.INVALID_NAME;
  if (error.status === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (error.status === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (error.status === 404) return ERROR_MESSAGES.NOT_FOUND;
  if (error.status === 500) return ERROR_MESSAGES.SERVER_ERROR;
  if (error.message?.includes('Network')) return ERROR_MESSAGES.NETWORK_ERROR;
  return error.message || ERROR_MESSAGES.SERVER_ERROR;
};
