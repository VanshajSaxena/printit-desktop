import log from "electron-log";
import createClient, { Client } from "openapi-fetch";
import type { paths } from "../gen/types/cloud-api-types";

export class CloudServiceApi {
  private client: Client<paths>;

  constructor() {
    log.info("Initialsizing OpenAPI client for Cloud API.");

    this.client = createClient<paths>({
      baseUrl: "http://localhost:3000",
    });
  }

  async ping() {
    const { data } = await this.client.GET("/api/v1/printers");
    return data;
  }
  async getTransactions() {
    const { data } = await this.client.GET("/api/v1/transactions");
    return data;
  }
}
