import { type FetchClientType } from "@api/client";
import type { TransactionEvent, TransactionOperation } from "./reducer";

export class ObservableExecutor {
  private dispatch: (event: TransactionEvent) => void;
  private fetchClient: FetchClientType;

  constructor(
    dispatch: (event: TransactionEvent) => void,
    queryClient: FetchClientType,
  ) {
    this.dispatch = dispatch;
    this.fetchClient = queryClient;
  }

  async execute(operation: TransactionOperation): Promise<void> {
    switch (operation.type) {
      case "download-files": {
        const { data } = await this.fetchClient.POST("/api/v1/files/download", {
          body: { ids: operation.files.map((file) => file.id) },
        });

        break;
      }

      default:
        break;
    }
  }
}
