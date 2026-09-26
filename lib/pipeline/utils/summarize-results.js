import { TREND_DIRECTION } from "#lib/analysis/index.js";

const formatPct = (value) => {
  if (value === null) {
    return "n/a";
  }

  return value > 0 ? `+${value}%` : `${value}%`;
};

export const summarizeResults = (results) =>
  results
    .map(
      ({
        lang,
        article,
        trend,
        trend_pct_per_year,
        yoy_growth_pct,
        confidence,
      }) => {
        const trendPct = formatPct(trend_pct_per_year);
        const trendText =
          trend === TREND_DIRECTION.NO_CLEAR_TREND
            ? trend
            : `${trend} (${trendPct}/yr)`;
        const yoyPct = formatPct(yoy_growth_pct);

        return `${lang} "${article}": ${trendText}, YoY ${yoyPct}, confidence ${confidence}`;
      },
    )
    .join("; ");
