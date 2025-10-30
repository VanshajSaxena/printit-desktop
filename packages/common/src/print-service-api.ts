import createClient from 'openapi-fetch';
import { paths } from '@gen/types/print-service-api';

export class PrintServiceApi {
  private client;

  constructor() {
    this.client = createClient<paths>({
      baseUrl: 'http://localhost:5000/api/v1',
    });
  }

  async ping() {
    await this.client.GET('/api/v1/ping');
  }

  async getPrintQueues() {
    await this.client.GET('/api/v1/printqueues');
  }

  async getPrintQueueCapabilities(queueName: string) {
    await this.client.GET('/api/v1/printqueues/{queueName}/capabilities', {
      params: { path: { queueName: queueName } },
    });
  }
}
