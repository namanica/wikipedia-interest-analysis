import { FONT_FAMILY } from "#lib/utils/index.js";
import { CHART_STYLE } from "../constants/index.js";

const FONT_SIZE = { TITLE: 15, SUBTITLE: 11, AXIS: 11 };
const LEGEND_COLUMNS = 2;
const WIDE_LEGEND_COLUMNS = 4;
const MAX_NARROW_LEGEND_ITEMS = 6;

export const buildBaseSpec = ({ title, subtitle, legendItems = 0 }) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  width: CHART_STYLE.WIDTH,
  height: CHART_STYLE.HEIGHT,
  background: CHART_STYLE.BACKGROUND,
  padding: FONT_SIZE.TITLE,
  title: {
    text: title,
    subtitle,
    anchor: "start",
    fontSize: FONT_SIZE.TITLE,
    subtitleFontSize: FONT_SIZE.SUBTITLE,
    color: CHART_STYLE.TEXT_COLOR,
    subtitleColor: CHART_STYLE.MUTED_COLOR,
  },
  config: {
    font: FONT_FAMILY,
    view: { stroke: null },
    axis: {
      labelFontSize: FONT_SIZE.AXIS,
      titleFontSize: FONT_SIZE.AXIS,
      titleFontWeight: "normal",
      labelColor: CHART_STYLE.MUTED_COLOR,
      titleColor: CHART_STYLE.MUTED_COLOR,
      gridColor: CHART_STYLE.GRID_COLOR,
      domainColor: CHART_STYLE.GRID_COLOR,
      tickColor: CHART_STYLE.GRID_COLOR,
    },
    legend: {
      labelFontSize: FONT_SIZE.AXIS,
      labelLimit: CHART_STYLE.LEGEND_LABEL_LIMIT,
      orient: "bottom",
      columns:
        legendItems > MAX_NARROW_LEGEND_ITEMS
          ? WIDE_LEGEND_COLUMNS
          : LEGEND_COLUMNS,
      title: null,
    },
  },
});
