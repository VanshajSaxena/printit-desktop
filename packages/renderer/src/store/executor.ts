import { type FetchClientType } from "@api/client";
import { downloadFilesToFileSystem, spoolFilesToPrinter } from "@app/preload";
import type { ReducerEvent } from "./events";
import type { TransactionOperation } from "./operations";

export class ObservableExecutor {
  private dispatch: (event: ReducerEvent) => void;
  private fetchClient: FetchClientType;

  constructor(
    dispatch: (event: ReducerEvent) => void,
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
      case "download-files-to-file-system": {
        const { data } = await this.fetchClient.POST("/api/v1/files/download", {
          body: { ids: operation.files.map((file) => file.id) },
        });

        if (!data) {
          this.dispatch({
            type: "files:download:error:all",
            reason: "presigned-url-fetch-failed",
            transactionId: operation.transactionId,
          });
          break;
        }

        this.dispatch({
          type: "files:download:started:all",
          transactionId: operation.transactionId,
        });

        const downloadedFiles = await downloadFilesToFileSystem(
          operation.transactionId,
          data.signedUrls,
        );

        this.dispatch({
          type: "files:download:completed:all",
          transactionId: operation.transactionId,
          downloadedFiles,
        });
        break;
      }
      case "spool-files-to-printer": {
        const documentPath = operation.job.document.filePath;
        if (!documentPath) {
          return;
        }
        const response = await spoolFilesToPrinter("hp smart tank 580", {
          documentPath,
          ticket: {},
        });

        if (response.success) {
          this.dispatch({
            type: "files:spooled:success:all",
            printJobInfo: response.data,
            transactionId: operation.transactionId,
          });
        }
        break;
      }

      default:
        break;
    }
  }
}
