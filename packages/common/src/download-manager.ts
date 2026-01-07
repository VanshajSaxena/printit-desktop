import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { app } from "electron";
import path, { join } from "path";
import { pipeline } from "stream/promises";

export const downloadManager = {
  async downloadFiles(
    files: { id: number; url: string; contentType: string }[],
  ) {
    const batchId = randomUUID();
    const appName = app.getName();
    const baseDir = path.join(app.getPath("appData"), appName);
    const downloadDir = path.join(baseDir, "downloads");

    await mkdir(downloadDir, { recursive: true });

    await Promise.all(
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

        await pipeline(response.body, fileStream);
        console.log("file downloaded successfully");
      }),
    );

    return {
      batchId,
      path: downloadDir,
      fileCount: files.length,
    };
  },
};
