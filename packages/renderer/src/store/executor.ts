import { type FetchClientType } from "@api/client";
import { downloadFiles } from "@app/preload";
import type { TransactionEvent } from "./events";
import type { TransactionOperation } from "./operations";

export class ObservableExecutor {
  private dispatch: (event: TransactionEvent) => void;
  private fetchClient: FetchClientType;

  constructor(
    dispatch: (event: TransactionEvent) => void,
    fetchClient: FetchClientType,
  ) {
    this.dispatch = dispatch;
    this.fetchClient = fetchClient;
  }

  async execute(operation: TransactionOperation): Promise<void> {
    switch (operation.type) {
      case "fetch-transactions": {
        const { data } = await this.fetchClient.GET("/api/v1/transactions", {
          params: { query: { status: "PENDING" } },
        });
        if (data) {
          this.dispatch({ type: "transaction:response", response: data });
        }
        break;
      }
      case "download-files": {
        const { data } = await this.fetchClient.POST("/api/v1/files/download", {
          body: { ids: operation.files.map((file) => file.id) },
        });

        if (!data) {
          this.dispatch({
            type: "files:download:error",
            reason: "presigned-url-fetch-failed",
            transactionId: operation.transactionId,
          });
          break;
        }

        this.dispatch({
          type: "files:download:started",
          transactionId: operation.transactionId,
        });
        const downloadResult = await downloadFiles(
          operation.transactionId,
          data.signedUrls,
        );

        break;
      }

      default:
        break;
    }
  }
}
