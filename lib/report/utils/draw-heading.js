import { REPORT_FONT, REPORT_LAYOUT } from "../constants/index.js";

export const drawHeading = (doc, text) => {
  doc
    .moveDown(REPORT_LAYOUT.SECTION_GAP / REPORT_LAYOUT.FONT_SIZE.BODY)
    .font(REPORT_FONT.BOLD)
    .fontSize(REPORT_LAYOUT.FONT_SIZE.HEADING)
    .fillColor(REPORT_LAYOUT.COLOR.TEXT)
    .text(text)
    .font(REPORT_FONT.REGULAR);
};
