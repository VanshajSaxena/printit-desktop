import log from "electron-log";
import createClient, { type Client } from "openapi-fetch";
import type {
  ErrorResponseCode,
  ErrorResponseDto,
  PrintCapabilitiesDto,
  PrintJobDto,
  PrintJobInfoDto,
  PrintQueueDto,
  PrintQueueStatusDto,
  paths as PrintServicePaths,
} from "../gen/types/print-service-api-types.ts";

export type IPCResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: ErrorResponseCode };

function toIpcError(error: ErrorResponseDto): IPCResponse<never> {
  return {
    success: false,
    code: error.code,
    error: error.message,
  };
}

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

  async ping(): Promise<IPCResponse<string | undefined>> {
    const { data, error } = await this.client.GET("/api/v1/ping");
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async getPrintQueues(): Promise<IPCResponse<string[] | undefined>> {
    const { data, error } = await this.client.GET("/api/v1/printqueues");
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async getPrintQueue(
    queueName: string,
  ): Promise<IPCResponse<PrintQueueDto | undefined>> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}",
      {
        params: { path: { queueName } },
      },
    );
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async getPrintQueueStatus(
    queueName: string,
  ): Promise<IPCResponse<PrintQueueStatusDto[] | undefined>> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}/status",
      {
        params: { path: { queueName } },
      },
    );
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async getPrintQueueCapabilities(
    queueName: string,
  ): Promise<IPCResponse<PrintCapabilitiesDto | undefined>> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}/capabilities",
      {
        params: { path: { queueName } },
      },
    );
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async getPrintJob(
    queueName: string,
    jobId: number,
  ): Promise<IPCResponse<PrintJobInfoDto | undefined>> {
    const { data, error } = await this.client.GET(
      "/api/v1/printqueues/{queueName}/jobs/{jobId}",
      { params: { path: { queueName, jobId } } },
    );
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }

  async cratePrintJob(
    queueName: string,
    printJob: PrintJobDto,
  ): Promise<IPCResponse<PrintJobInfoDto | undefined>> {
    const { data, error } = await this.client.POST(
      "/api/v1/printqueues/{queueName}/jobs",
      {
        params: { path: { queueName } },
        body: printJob,
      },
    );
    if (error) {
      this.logger.error(error);
      return toIpcError(error);
    }
    return { success: true, data };
  }
}
