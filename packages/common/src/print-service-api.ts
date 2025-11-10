import createClient, { Client } from 'openapi-fetch';
import type {
  paths as PrintServicePaths,
  PrintCapabilitiesDto,
  PrintJobDto,
  PrintJobInfoDto,
  PrintQueueDto,
} from '../gen/types/print-service-api-types';
import log from 'electron-log';

export class PrintServiceApi {
  private client: Client<PrintServicePaths>;

  constructor() {
    log.info('Initialsizing OpenAPI client for Cloud API.');
    this.client = createClient<PrintServicePaths>({
      baseUrl: 'http://localhost:5000',
    });
  }

  async ping(): Promise<string | undefined> {
    const { data } = await this.client.GET('/api/v1/ping');
    return data;
  }

  async getPrintQueues(): Promise<string[] | undefined> {
    const { data } = await this.client.GET('/api/v1/printqueues');
    return data;
  }

  async getPrintQueue(queueName: string): Promise<PrintQueueDto | undefined> {
    const { data } = await this.client.GET('/api/v1/printqueues/{queueName}', {
      params: { path: { queueName: queueName } },
    });
    return data;
  }

  async getPrintQueueCapabilities(
    queueName: string,
  ): Promise<PrintCapabilitiesDto | undefined> {
    const { data } = await this.client.GET(
      '/api/v1/printqueues/{queueName}/capabilities',
      {
        params: { path: { queueName: queueName } },
      },
    );
    return data;
  }

  async cratePrintJob(
    queueName: string,
    printJob: PrintJobDto,
  ): Promise<PrintJobInfoDto | undefined> {
    const { data } = await this.client.POST(
      '/api/v1/printqueues/{queueName}/jobs',
      {
        params: { path: { queueName: queueName } },
        body: printJob,
      },
    );
    return data;
  }
}
