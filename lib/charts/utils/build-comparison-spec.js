import { CHART_STYLE, DATE_ENCODING } from "../constants/index.js";
import { buildBaseSpec } from "./build-base-spec.js";

const BASELINE = 100;

export const buildComparisonSpec = ({ series, title, subtitle, unit }) => {
  const values = series.flatMap(({ lang, article, index }) =>
    index.map((point) => ({ ...point, series: `${lang}: ${article}` })),
  );

  return {
    ...buildBaseSpec({ title, subtitle }),
    layer: [
      {
        data: { values: [{ value: BASELINE }] },
        mark: { type: "rule", color: CHART_STYLE.TREND_COLOR },
        encoding: { y: { field: "value", type: "quantitative" } },
      },
      {
        data: { values },
        mark: { type: "line" },
        encoding: {
          x: DATE_ENCODING,
          y: { field: "value", type: "quantitative", title: unit },
          color: {
            field: "series",
            type: "nominal",
            scale: { range: CHART_STYLE.PALETTE },
          },
        },
      },
    ],
  };
};
