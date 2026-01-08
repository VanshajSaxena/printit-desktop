import { type FetchClientType } from "@api/client";
import { downloadFiles } from "@app/preload";
import type { TransactionEvent, TransactionOperation } from "./types";

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
      case "download-files": {
        const { data } = await this.fetchClient.POST("/api/v1/files/download", {
          body: { ids: operation.files.map((file) => file.id) },
        });

        if (data?.signedUrls) {
          await downloadFiles(data.signedUrls);
          this.dispatch({ type: "files:download:started" });
        }

        break;
      }

      default:
        break;
    }
  }
}
