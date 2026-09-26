import { CHART_LABELS } from "./constants/index.js";
import {
  buildComparisonSpec,
  buildTrendSpec,
  specToSvg,
} from "./utils/index.js";

export const buildChartSvg = ({
  series,
  title,
  subtitle,
  raw = false,
  labels = CHART_LABELS,
}) => {
  const isComparison = series.length > 1;
  const unit = raw ? labels.RAW_UNIT : labels.NORMALIZED_UNIT;
  const spec = isComparison
    ? buildComparisonSpec({ series, title, subtitle, unit: labels.INDEX_UNIT })
    : buildTrendSpec({ series: series[0], title, subtitle, unit });

  return specToSvg(spec);
};
