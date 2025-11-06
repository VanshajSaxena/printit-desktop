import createClient, { Client } from 'openapi-fetch';
import type { paths } from '../gen/types/print-service-api-types';
import log from 'electron-log';

export class PrintServiceApi {
  private client: Client<paths>;

  constructor() {
    log.error('openapi-client installed');
    this.client = createClient<paths>({
      baseUrl: 'http://localhost:5000',
    });
  }

  async ping() {
    const { data } = await this.client.GET('/api/v1/ping');
    return data;
  }

  async getPrintQueues() {
    const { data } = await this.client.GET('/api/v1/printqueues');
    return data;
  }

  async getPrintQueue(queueName: string) {
    await this.client.GET('/api/v1/printqueues/{queueName}', {
      params: { path: { queueName: queueName } },
    });
  }

  async getPrintQueueCapabilities(queueName: string) {
    await this.client.GET('/api/v1/printqueues/{queueName}/capabilities', {
      params: { path: { queueName: queueName } },
    });
  }
}
