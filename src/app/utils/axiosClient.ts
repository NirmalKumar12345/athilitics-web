import axios, {
  Method,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';
import qs from 'qs';
import { getBaseURL } from './envClient';
import { logout, StorageService } from './storageService';
import { isNil } from 'lodash';

type Data = Record<string, unknown>;
type Param = Data | Array<unknown>;

let axiosInstance: ReturnType<typeof axios.create> | null = null;

const createAxiosInstance = async () => {
  if (axiosInstance) return axiosInstance;

  const baseURL = await getBaseURL();
  axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
  });

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = StorageService.authToken.getValue();
      if (accessToken) {
        if (!config.headers) {
          config.headers = {} as AxiosHeaders;
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('[Axios Interceptor] Request error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (!error.response) {
        console.error('[Axios Interceptor] No response from server:', error.message);
        return Promise.reject(error);
      }

      if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        console.warn('[Axios Interceptor] 401 Unauthorized - triggering logout');
        logout();
        return Promise.reject(error);
      }

      console.error('[Axios Interceptor] Other error:', error.response);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const getHttpClient = async <T>(
  path: string,
  method: Method,
  data: Data | null = null,
  params: Param | null = null,
  responseType?: 'json' | 'blob'
): Promise<T> => {
  const query = !isNil(params) ? '?' + qs.stringify(params, { allowDots: true }) : '';
  const urlPath = path + query;

  const axiosInstance = await createAxiosInstance();

  try {
    const response = await axiosInstance({
      method: method,
      url: urlPath,
      data: data,
      responseType: responseType,
    });
    return response.data as T;
  } catch (error: unknown) {
    console.error('[getHttpClient] Request failed:', error);
    throw error;
  }
};

class ServerException extends Error {
  status: number;
  response: Param | null;

  constructor(message: string | undefined, status: number, response: Data | null) {
    super(message);
    this.name = 'ServerException';
    this.status = status;
    this.response = response;
  }
}

;
