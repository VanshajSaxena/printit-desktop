import axios, { AxiosInstance } from 'axios';
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
          console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        if (this.config.enabledLogging) {
          console.log(
            `[API Response] ${String(response.config.url)} - ${String(response.status)}`,
          );
        }
        return response;
      },
      (error: Error) => {
        if (this.config.enabledLogging) {
          console.error('[API Response Error]', error.message);
        }
        return Promise.reject(error);
      },
    );
  }
}
