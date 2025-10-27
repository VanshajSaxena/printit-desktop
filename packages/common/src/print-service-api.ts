import {
  PrintCapabilitiesDto,
  PrintQueueDto,
} from '@gen/types/print-service-api';
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

  async getPrintQueues(): Promise<[string]> {
    return this.client.get('printqueues');
  }
  async getPrintQueue(printQueue: string): Promise<PrintQueueDto> {
    return this.client.get(`printqueues/${printQueue}`);
  }
  async getPrintQueueCapabilitites(
    printQueue: string,
  ): Promise<PrintCapabilitiesDto> {
    return this.client.get(`printqueues/${printQueue}/capabilities`);
  }
}
