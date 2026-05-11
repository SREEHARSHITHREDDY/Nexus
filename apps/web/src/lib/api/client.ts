import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
  } from 'axios';
  
  const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api';
  
  export const apiClient: AxiosInstance = axios.create({
    baseURL:         BASE_URL,
    timeout:         30_000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
  });
  
  // ── Request interceptor — attach access token ─────────────────
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('nexus:access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  
  // ── Response interceptor — 401 token refresh ──────────────────
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject:  (err: unknown)  => void;
  }> = [];
  
  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => {
      if (error) p.reject(error);
      else if (token) p.resolve(token);
    });
    failedQueue = [];
  };
  
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);
  
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
              },
              reject,
            });
          });
        }
  
        originalRequest._retry = true;
        isRefreshing            = true;
  
        try {
          const refreshToken = localStorage.getItem('nexus:refresh_token');
          if (!refreshToken) throw new Error('No refresh token');
  
          const { data } = await axios.post<{
            data: { accessToken: string; refreshToken: string };
          }>(`${BASE_URL}/v1/auth/refresh`, { refreshToken });
  
          const { accessToken, refreshToken: newRefresh } = data.data;
          localStorage.setItem('nexus:access_token',  accessToken);
          localStorage.setItem('nexus:refresh_token', newRefresh);
  
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('nexus:access_token');
          localStorage.removeItem('nexus:refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
  
      return Promise.reject(error);
    },
  );