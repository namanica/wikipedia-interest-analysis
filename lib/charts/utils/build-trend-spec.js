import { CHART_STYLE, DATE_ENCODING } from "../constants/index.js";
import { buildBaseSpec } from "./build-base-spec.js";

const SPIKE_OPACITY = 0.5;

export const buildTrendSpec = ({ series, title, subtitle, unit }) => {
  const valueEncoding = { field: "value", type: "quantitative", title: unit };

  return {
    ...buildBaseSpec({ title, subtitle }),
    layer: [
      {
        data: { values: series.spikes.map((date) => ({ date })) },
        mark: {
          type: "rule",
          color: CHART_STYLE.SPIKE_COLOR,
          opacity: SPIKE_OPACITY,
        },
        encoding: { x: DATE_ENCODING },
      },
      {
        data: { values: series.points },
        mark: { type: "line", point: true, color: CHART_STYLE.LINE_COLOR },
        encoding: { x: DATE_ENCODING, y: valueEncoding },
      },
      {
        data: { values: series.trend },
        mark: {
          type: "line",
          color: CHART_STYLE.TREND_COLOR,
          strokeDash: [CHART_STYLE.TREND_DASH, CHART_STYLE.TREND_GAP],
        },
        encoding: { x: DATE_ENCODING, y: valueEncoding },
      },
    ],
  };
};
