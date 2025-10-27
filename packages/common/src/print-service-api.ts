import { HttpClient } from './http-client';

export class PrintServiceApi {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      baseUrl: 'http://localhost:5000/api/v1',
      timeout: 30000,
      enabledLogging: true,
    });
  }

  async ping(): Promise<string> {
    return await this.client.get('ping');
  }
}
