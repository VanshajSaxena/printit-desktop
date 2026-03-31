import { app } from "electron";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import path, { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

export const downloadManager = {
  async downloadFiles(
    transactionId: number,
    files: { id: number; url: string; contentType: string }[],
  ) {
    const appName = app.getName();
    const baseDir = path.join(app.getPath("appData"), appName);
    const downloadDir = path.join(
      baseDir,
      "downloads",
      transactionId.toString(),
    );

    await mkdir(downloadDir, { recursive: true });

    const downloadedFiles = await Promise.all(
      files.map(async ({ id, url, contentType }) => {
        const response = await fetch(url);

        if (!response.ok || !response.body) {
          throw new Error(
            `Failed to download file ${String(id)}: ${String(response.status)} ${response.statusText}`,
          );
        }

        const extention = contentType.substring(contentType.indexOf("/") + 1);
        const filePath = join(downloadDir, `${String(id)}.${extention}`);
        const fileStream = createWriteStream(filePath);

        await pipeline(
          Readable.fromWeb(
            response.body as unknown as import("stream/web").ReadableStream,
          ),
          fileStream,
        );
        return { id, filePath };
      }),
    );

    console.log("files downloaded successfully");
    return downloadedFiles;
  },
};
