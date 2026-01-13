import createClient, { type Client } from "openapi-fetch";
import type {
  paths as PrintServicePaths,
  PrintCapabilitiesDto,
  PrintJobDto,
  PrintJobInfoDto,
  PrintQueueDto,
} from "../gen/types/print-service-api-types.ts";
import log from "electron-log";

export class PrintServiceApi {
  private client: Client<PrintServicePaths>;
  private logger: log.LogFunctions;

  constructor() {
    log.info("Initialsizing OpenAPI client for PrintService API.");
    this.logger = log.scope(PrintServiceApi.name);
    this.client = createClient<PrintServicePaths>({
      baseUrl: "http://localhost:5000",
    });
  }

  async ping(): Promise<string | undefined> {
    const { data, error } = await this.client.GET("/api/v1/ping");
    this.logger.error(error);
    return data;
  }

  async getPrintQueues(): Promise<string[] | undefined> {
    const { data, error } = await this.client.GET("/api/v1/printqueues");
    this.logger.error(error);
    return data;
  }

  async getPrintQueue(queueName: string): Promise<PrintQueueDto | undefined> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}",
      {
        params: { path: { queueName: queueName } },
      },
    );
    this.logger.error(error);
    return data;
  }

  async getPrintQueueCapabilities(
    queueName: string,
  ): Promise<PrintCapabilitiesDto | undefined> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}/capabilities",
      {
        params: { path: { queueName: queueName } },
      },
    );
    this.logger.error(error);
    return data;
  }

  async cratePrintJob(
    queueName: string,
    printJob: PrintJobDto,
  ): Promise<PrintJobInfoDto | undefined> {
    const { data, error } = await this.client.POST(
      "/api/v1/printqueues/{queueName}/jobs",
      {
        params: { path: { queueName: queueName } },
        body: printJob,
      },
    );
    this.logger.error(error);
    return data;
  }
}
