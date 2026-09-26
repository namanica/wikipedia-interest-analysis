import { REPORT_LAYOUT } from "../constants/index.js";
import { drawParagraph } from "./draw-paragraph.js";

export const drawList = (doc, lines) => {
  lines.forEach((line) => {
    drawParagraph(doc, `• ${line}`, {
      size: REPORT_LAYOUT.FONT_SIZE.SMALL,
      color: REPORT_LAYOUT.COLOR.TEXT,
    });
  });
};
