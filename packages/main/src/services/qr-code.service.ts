import { app } from "electron";
import fs from "fs";
import path from "path";
import { PageSizes, PDFDocument } from "pdf-lib";

export async function generateQrCodePdf(qrDataUrl: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A4);

  const base64Data = qrDataUrl.split(",")[1];
  const imageBytes = Buffer.from(base64Data, "base64");

  const qrImage = await pdfDoc.embedPng(imageBytes);

  const { width, height } = qrImage.scale(0.7);

  page.drawImage(qrImage, {
    x: (page.getWidth() - width) / 2,
    y: (page.getHeight() - height) / 2,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();

  const filePath = path.join(app.getPath("downloads"), "qr-code.pdf");

  fs.writeFileSync(filePath, pdfBytes);

  return { path: filePath };
}
