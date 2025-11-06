import { paths as CloudApiPaths } from 'gen/types/cloud-api-types';
import log from 'electron-log';
import createClient, { Client } from 'openapi-fetch';

export class CloudServiceApi {
  private client: Client<CloudApiPaths>;

  constructor() {
    log.info('Initialsizing OpenAPI client for Cloud API.');

    this.client = createClient<CloudApiPaths>({
      baseUrl: 'http://localhost:3000',
    });
  }

  async ping() {
    const { data } = await this.client.GET('/api/v1/printers');
    return data;
  }
}
