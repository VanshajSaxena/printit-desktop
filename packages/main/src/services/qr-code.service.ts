import fontkit from "@pdf-lib/fontkit";
import { app } from "electron";
import fs from "fs";
import path from "path";
import { PageSizes, PDFDocument, rgb } from "pdf-lib";
import { fileURLToPath } from "url";

/** Draws a rounded rectangle via an SVG path (pdf-lib has no native support). */
function centeredX(
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  text: string,
  size: number,
  cx: number,
): number {
  return cx - font.widthOfTextAtSize(text, size) / 2;
}

export async function generateQrCodePdf(qrDataUrl: string) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const cx = width / 2;

  const fontDir = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "fonts")
    : path.join(
        fileURLToPath(import.meta.url),
        "../../../../packages/renderer/src/assets/fonts",
      );

  const fontBold = await pdfDoc.embedFont(
    fs.readFileSync(path.join(fontDir, "Inter-Bold.woff2")),
  );
  const fontRegular = await pdfDoc.embedFont(
    fs.readFileSync(path.join(fontDir, "Inter-Medium.woff2")),
  );

  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrDataUrl.split(",")[1], "base64"),
  );

  const logoPath = app.isPackaged
    ? path.join(process.resourcesPath, "buildResources", "logo.png")
    : path.join(
        fileURLToPath(import.meta.url),
        "../../../../buildResources/printit-logo.png",
      );
  const logoImage = await pdfDoc.embedPng(fs.readFileSync(logoPath));

  const color = {
    text: rgb(0.08, 0.08, 0.08),
    muted: rgb(0.4, 0.4, 0.4),
    faint: rgb(0.56, 0.56, 0.56),
    divider: rgb(0.88, 0.88, 0.88),
    qrBorder: rgb(0.14, 0.14, 0.14),
    qrBg: rgb(0.976, 0.976, 0.976),
  };

  const qrSize = 272;
  const qrPad = 28;
  const qrBlock = qrSize + qrPad * 2;

  const HEADING = { size: 36, tracking: 3 };
  const SUBTITLE = { size: 13, tracking: 2 };
  const STEPS = { size: 13.5, tracking: 0.4 };
  const PRIVACY = { size: 9.5, tracking: 0 };
  const BRAND = { size: 9.5, tracking: 0.8 };

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

  const heading = "SCAN TO PRINT";
  page.drawText(heading, {
    x: centeredX(fontBold, heading, HEADING.size, cx),
    y,
    size: HEADING.size,
    font: fontBold,
    color: color.text,
  });
  y -= HEADING.size + gap.afterHeading;

  const subtitle = "Fast · Private · Zero-Trace";
  page.drawText(subtitle, {
    x: centeredX(fontRegular, subtitle, SUBTITLE.size, cx),
    y,
    size: SUBTITLE.size,
    font: fontRegular,
    color: color.muted,
  });
  y -= SUBTITLE.size + gap.afterSubtitle;

  const by = y - qrBlock;

  page.drawImage(qrImage, {
    x: cx - qrSize / 2,
    y: by + qrPad,
    width: qrSize,
    height: qrSize,
  });
  y -= qrBlock + gap.afterQr;

  const steps = "1. Scan QR   ·   2. Select Files   ·   3. Pickup";
  page.drawText(steps, {
    x: centeredX(fontBold, steps, STEPS.size, cx),
    y,
    size: STEPS.size,
    font: fontBold,
    color: color.text,
  });
  y -= STEPS.size + gap.afterSteps;

  const divHalf = 72;
  page.drawLine({
    start: { x: cx - divHalf, y },
    end: { x: cx + divHalf, y },
    thickness: 0.75,
    color: color.divider,
  });
  y -= gap.afterDivider;

  const privacy = "Documents are auto-deleted immediately after printing.";
  page.drawText(privacy, {
    x: centeredX(fontRegular, privacy, PRIVACY.size, cx),
    y,
    size: PRIVACY.size,
    font: fontRegular,
    color: color.faint,
  });

  const logoDims = logoImage.scale(0.22);
  const footerBase = 78;

  page.drawImage(logoImage, {
    x: cx - logoDims.width / 2,
    y: footerBase + 12,
    width: logoDims.width,
    height: logoDims.height,
  });

  page.drawText("printit․ink", {
    x: centeredX(fontRegular, "printit.ink", BRAND.size, cx),
    y: footerBase - 6,
    size: BRAND.size,
    font: fontRegular,
    color: color.faint,
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(app.getPath("downloads"), "printit-qr-code.pdf");
  fs.writeFileSync(filePath, pdfBytes);

  return { path: filePath };
}
