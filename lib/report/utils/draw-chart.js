import { FONT_FAMILY } from "#lib/utils/index.js";
import { REPORT_FONT, REPORT_LAYOUT } from "../constants/index.js";
import { getContentWidth } from "./get-content-width.js";

const pickFont = (family, bold) =>
  family.includes(FONT_FAMILY) && bold ? REPORT_FONT.BOLD : REPORT_FONT.REGULAR;

export const drawChart = async (doc, svg) => {
  const { default: svgToPdf } = await import("svg-to-pdfkit");
  const top = doc.y + REPORT_LAYOUT.SECTION_GAP;

  svgToPdf(doc, svg, doc.page.margins.left, top, {
    width: getContentWidth(doc),
    height: REPORT_LAYOUT.CHART_HEIGHT,
    preserveAspectRatio: "xMinYMin meet",
    fontCallback: pickFont,
  });
  doc.y = top + REPORT_LAYOUT.CHART_HEIGHT;
  doc.x = doc.page.margins.left;
};
