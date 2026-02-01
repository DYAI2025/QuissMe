import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config/config';
import { storage } from '../utils/storage';

// Custom error class
export class ApiException extends Error {
  constructor(
    public code: string,
    public status: number,
    public details: any,
    message: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = storage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${config.api.baseURL}${config.api.endpoints.refresh}`,
            { refresh_token: refreshToken }
          );
          const { access_token, refresh_token } = response.data;
          storage.setToken(access_token);
          storage.setRefreshToken(refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        storage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const status = error.response?.status || 500;
    const data = error.response?.data as any;
    const message = data?.detail || error.message || 'An error occurred';
    const code = data?.code || 'UNKNOWN_ERROR';

    return Promise.reject(
      new ApiException(code, status, data, message)
    );
  }
);

export default apiClient;
