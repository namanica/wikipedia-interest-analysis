import { REPORT_FONT, REPORT_LAYOUT } from "../constants/index.js";

export const drawParagraph = (
  doc,
  text,
  {
    size = REPORT_LAYOUT.FONT_SIZE.BODY,
    color = REPORT_LAYOUT.COLOR.TEXT,
  } = {},
) => {
  doc.font(REPORT_FONT.REGULAR).fontSize(size).fillColor(color).text(text);
};
