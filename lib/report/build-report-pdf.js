import { REPORT_FONT, REPORT_LAYOUT } from "./constants/index.js";
import {
  assertSinglePage,
  buildAssumptionLines,
  buildConfidenceLines,
  buildLimitationLines,
  createDocument,
  drawChart,
  drawHeading,
  drawList,
  drawMetricsTable,
  drawParagraph,
  saveDocument,
} from "./utils/index.js";

export const buildReportPdf = async ({
  filePath,
  text,
  question,
  summary,
  next,
  rows,
  period,
  raw,
  keepSpikes,
  limitations,
  chartSvg,
}) => {
  const doc = await createDocument();
  const { FONT_SIZE, COLOR } = REPORT_LAYOUT;

  doc
    .font(REPORT_FONT.BOLD)
    .fontSize(FONT_SIZE.TITLE)
    .fillColor(COLOR.TEXT)
    .text(question);
  drawHeading(doc, text.CONCLUSION);
  drawParagraph(doc, summary);
  await drawChart(doc, chartSvg);
  drawHeading(doc, text.METRICS);
  drawMetricsTable(doc, { rows, text });
  drawHeading(doc, text.CONFIDENCE);
  drawParagraph(doc, buildConfidenceLines({ text, rows }).join("; "), {
    size: FONT_SIZE.SMALL,
  });
  drawHeading(doc, text.ASSUMPTIONS);
  drawList(doc, buildAssumptionLines({ text, period, raw, keepSpikes }));
  drawHeading(doc, text.LIMITATIONS);
  drawList(doc, buildLimitationLines({ text, limitations }));
  drawHeading(doc, text.NEXT);
  drawParagraph(doc, next);
  drawParagraph(doc, `\n${text.SOURCE(period.end)}`, {
    size: FONT_SIZE.SMALL,
    color: COLOR.MUTED,
  });
  assertSinglePage(doc);
  await saveDocument(doc, filePath);

  return filePath;
};
