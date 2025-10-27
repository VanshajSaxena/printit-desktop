import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import log from 'electron-log';

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  enabledLogging?: boolean;
}

export class HttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      enabledLogging: true,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setInterceptiors();
  }

  private setInterceptiors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.enabledLogging) {
          log.debug(
            `[API Request] ${String(config.method?.toUpperCase())} ${String(config.url)}`,
          );
        }
        return config;
      },
      (error: Error) => {
        if (this.config.enabledLogging) {
          log.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        if (this.config.enabledLogging) {
          log.info(
            `[API Response] ${String(response.config.url)} - ${String(response.status)}`,
          );
        }
        return response;
      },
      (error: Error) => {
        if (this.config.enabledLogging) {
          log.error('[API Response Error]', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, {
      ...config,
      timeout: config?.timeout,
    });
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, {
      ...config,
      timeout: config?.timeout,
    });
    return response.data;
  }
}
