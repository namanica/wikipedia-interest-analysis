import { buildTrendLine } from "./build-trend-line.js";
import { pickTopSpikes } from "./pick-top-spikes.js";
import { roundTo } from "./round-to.js";
import { toIndexPoints } from "./to-index-points.js";

const CHART_DIGITS = 3;

const roundPoints = (points) =>
  points.map(({ date, value }) => ({
    date,
    value: roundTo(value, CHART_DIGITS),
  }));

export const buildChartData = ({ lang, article, selected, trend, spikes }) => ({
  lang,
  article,
  points: roundPoints(selected),
  index: roundPoints(toIndexPoints(selected)),
  trend: roundPoints(buildTrendLine(selected, trend.slopePerYear)),
  spikes: pickTopSpikes(spikes),
});
