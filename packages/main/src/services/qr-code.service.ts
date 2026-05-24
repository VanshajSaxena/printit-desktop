import fontkit from "@pdf-lib/fontkit";
import { app } from "electron";
import fs from "fs";
import path from "path";
import { PageSizes, PDFDocument } from "pdf-lib";
import { fileURLToPath } from "url";

/** Draws a rounded rectangle via an SVG path (pdf-lib has no native support). */
// function centeredX(
//   font: { widthOfTextAtSize: (t: string, s: number) => number },
//   text: string,
//   size: number,
//   cx: number,
// ): number {
//   return cx - font.widthOfTextAtSize(text, size) / 2;
// }

export async function generateQrCodePdf(
  qrDataUrl: string,
): Promise<{ path: string | undefined }> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const cx = width / 2;

  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrDataUrl.split(",")[1], "base64"),
  );

  const templatePath = path.resolve(
    app.isPackaged
      ? process.resourcesPath
      : path.join(fileURLToPath(import.meta.url), "../../../../buildResources"),
    "scan-to-print.png",
  );
  const templateImage = await pdfDoc.embedPng(fs.readFileSync(templatePath));

  const qrSize = 272;
  const qrPad = 28;
  const qrBlock = qrSize + qrPad * 2;

  const HEADING = { size: 36, tracking: 3 };
  const SUBTITLE = { size: 13, tracking: 2 };
  const STEPS = { size: 13.5, tracking: 0.4 };
  const PRIVACY = { size: 9.5, tracking: 0 };

  const gap = {
    afterHeading: 10,
    afterSubtitle: 56,
    afterQr: 44,
    afterSteps: 36,
    afterDivider: 22,
  };

  const footerH = 55;
  const contentH =
    HEADING.size +
    gap.afterHeading +
    SUBTITLE.size +
    gap.afterSubtitle +
    qrBlock +
    gap.afterQr +
    STEPS.size +
    gap.afterSteps +
    gap.afterDivider +
    PRIVACY.size;

  let y = height - (height - contentH - footerH) / 2;

  y -= SUBTITLE.size + gap.afterSubtitle;

  const by = y - qrBlock;

  page.drawImage(qrImage, {
    x: cx - qrSize / 2,
    y: by + qrPad,
    width: qrSize,
    height: qrSize,
  });
  y -= qrBlock + gap.afterQr;

  y -= STEPS.size + gap.afterSteps;

  y -= gap.afterDivider;

  const templateDims = templateImage.scale(0.25);

  page.drawImage(templateImage, {
    x: cx - templateDims.width / 2,
    y: (height - templateDims.height) / 2,
    width: templateDims.width,
    height: templateDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(app.getPath("downloads"), "printit-qr-code.pdf");
  fs.writeFileSync(filePath, pdfBytes);

  return { path: filePath };
}
