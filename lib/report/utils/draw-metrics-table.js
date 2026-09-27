import {
  REPORT_FONT,
  REPORT_LAYOUT,
  REPORT_LIMITS,
} from "../constants/index.js";
import { formatNumber } from "./format-number.js";
import { getContentWidth } from "./get-content-width.js";

const ARTICLE_COLUMN_WIDTH = 140;
const ARTICLE_COLUMN = 1;
const CELL_PADDING = 3;

const toPct = (value, locale) =>
  value === null || value === undefined
    ? formatNumber(value, locale)
    : `${formatNumber(value, locale, { signed: true })}%`;

const toCells = (row, text) => [
  row.lang,
  row.article,
  formatNumber(row.avg_monthly_views, text.NUMBER_LOCALE),
  text.TREND[row.trend.toUpperCase()],
  toPct(row.trend_pct_per_year, text.NUMBER_LOCALE),
  toPct(row.yoy_growth_pct, text.NUMBER_LOCALE),
  text.LEVEL[row.confidence.toUpperCase()],
];

const getWidths = (doc, count) => {
  const otherWidth =
    (getContentWidth(doc) - ARTICLE_COLUMN_WIDTH) / (count - 1);

  return Array.from({ length: count }, (_, index) =>
    index === ARTICLE_COLUMN ? ARTICLE_COLUMN_WIDTH : otherWidth,
  );
};

const drawRow = (doc, cells, widths, font) => {
  const top = doc.y;
  let x = doc.page.margins.left;

  doc.font(font).fontSize(REPORT_LAYOUT.FONT_SIZE.SMALL);
  cells.forEach((cell, index) => {
    doc.text(cell, x, top, {
      width: widths[index] - CELL_PADDING,
      height: REPORT_LAYOUT.ROW_HEIGHT - CELL_PADDING,
      lineBreak: false,
      ellipsis: true,
    });
    x += widths[index];
  });
  doc.y = top + REPORT_LAYOUT.ROW_HEIGHT;
  doc
    .moveTo(doc.page.margins.left, doc.y - CELL_PADDING)
    .lineTo(doc.page.margins.left + getContentWidth(doc), doc.y - CELL_PADDING)
    .strokeColor(REPORT_LAYOUT.COLOR.RULE)
    .stroke();
};

export const drawMetricsTable = (doc, { rows, text }) => {
  const widths = getWidths(doc, text.COLUMNS.length);

  doc.fillColor(REPORT_LAYOUT.COLOR.TEXT);
  drawRow(doc, text.COLUMNS, widths, REPORT_FONT.BOLD);
  const shown = rows.slice(0, REPORT_LIMITS.TABLE_ROWS);
  const hiddenCount = rows.length - shown.length;

  shown.forEach((row) =>
    drawRow(doc, toCells(row, text), widths, REPORT_FONT.REGULAR),
  );
  doc.x = doc.page.margins.left;

  if (hiddenCount > 0) {
    doc
      .font(REPORT_FONT.REGULAR)
      .fontSize(REPORT_LAYOUT.FONT_SIZE.SMALL)
      .fillColor(REPORT_LAYOUT.COLOR.MUTED)
      .text(text.MORE_ROWS(hiddenCount))
      .fillColor(REPORT_LAYOUT.COLOR.TEXT);
  }
};
