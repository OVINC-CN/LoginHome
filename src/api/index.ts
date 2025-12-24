import axios, { type AxiosError, type AxiosResponse } from 'axios';
import globalContext from '@/context';

export interface APIResponse<T = unknown> {
  message: string;
  data: T;
  trace: string;
}

export interface APIError {
  message: string;
  trace?: string;
  status?: number;
}

const http = axios.create({
  timeout: 10000,
  baseURL: globalContext.backendUrl,
  withCredentials: true,
});

http.interceptors.response.use(
  (res: AxiosResponse<APIResponse<unknown>>) => {
    // 200 status - return data directly
    const response = res.data;
    return response.data as unknown as AxiosResponse;
  },
  (err: AxiosError<APIResponse>) => {
    // Handle 401
    if (err.response?.status === 401) {
      const next = typeof window !== 'undefined' ? window.location.href : '';
      if (typeof window !== 'undefined' && window.location.href.indexOf('/login') === -1) {
        if (next.indexOf('next=') === -1) {
          window.location.href = `/login?next=${encodeURIComponent(next)}`;
        }
      }
    }
    
    // >= 400 - extract message from response
    const apiError: APIError = {
      message: err.response?.data?.message || err.message || 'Unknown error',
      trace: err.response?.data?.trace,
      status: err.response?.status,
    };
    
    return Promise.reject(apiError);
  }
);

export default http;
