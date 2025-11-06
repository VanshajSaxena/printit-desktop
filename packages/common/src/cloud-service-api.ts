import type {
  CreatePrintTransactionDto,
  paths,
  PrintTransactionResponseDto,
} from '../gen/types/cloud-api-types';
import log from 'electron-log';
import createClient, { Client } from 'openapi-fetch';

export class CloudServiceApi {
  private client: Client<paths>;

  constructor() {
    log.info('Initialsizing OpenAPI client for Cloud API.');

    this.client = createClient<paths>({
      baseUrl: 'http://localhost:3000',
    });
  }

  async ping(): Promise<string | undefined> {
    const { data } = await this.client.GET('/api/v1/printers');
    return data;
  }
  async getTransactions(): Promise<PrintTransactionResponseDto | undefined> {
    const { data } = await this.client.GET('/api/v1/transactions');
    return data;
  }
  async createTransaction(
    transaction: CreatePrintTransactionDto,
  ): Promise<PrintTransactionResponseDto | undefined> {
    const { data } = await this.client.POST('/api/v1/transactions', {
      body: transaction,
    });
    return data;
  }
}
