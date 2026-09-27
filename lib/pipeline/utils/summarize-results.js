import { CONFIDENCE, TREND_DIRECTION } from "#lib/analysis/index.js";
import { formatPct } from "#lib/utils/index.js";

const MAX_DETAILED_RESULTS = 3;

const describeResult = ({
  lang,
  article,
  trend,
  trend_pct_per_year,
  yoy_growth_pct,
  confidence,
}) => {
  const name = `${lang} "${article}"`;

  if (confidence === CONFIDENCE.LOW) {
    return `${name}: too little reliable data for a conclusion (confidence low)`;
  }

  if (trend === TREND_DIRECTION.NO_CLEAR_TREND) {
    return `${name}: no clear trend, confidence ${confidence}`;
  }

  const trendPct = formatPct(trend_pct_per_year);
  const yoyPct = formatPct(yoy_growth_pct);

  return `${name}: ${trend} (${trendPct}/yr), YoY ${yoyPct}, confidence ${confidence}`;
};

const countBy = (results, field) =>
  Object.entries(Object.groupBy(results, (result) => result[field])).map(
    ([value, group]) => `${group.length} ${value}`,
  );

export const summarizeResults = (results) => {
  if (results.length <= MAX_DETAILED_RESULTS) {
    return results.map(describeResult).join("; ");
  }

  const trends = countBy(results, "trend").join(", ");
  const confidence = countBy(results, "confidence").join(", ");

  return `${results.length} languages: ${trends}; confidence: ${confidence}. See data.ranking.highlights.`;
};
