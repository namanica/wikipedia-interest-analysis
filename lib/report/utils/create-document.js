import { FONT_FILES } from "#lib/utils/index.js";
import { REPORT_FONT, REPORT_LAYOUT } from "../constants/index.js";

export const createDocument = async () => {
  const { default: PDFDocument } = await import("pdfkit");
  const doc = new PDFDocument({
    size: "A4",
    margin: REPORT_LAYOUT.MARGIN,
    bufferPages: true,
  });

  doc.registerFont(REPORT_FONT.REGULAR, FONT_FILES.REGULAR);
  doc.registerFont(REPORT_FONT.BOLD, FONT_FILES.BOLD);
  doc.font(REPORT_FONT.REGULAR);

  return doc;
};
