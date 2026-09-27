import { CONFIDENCE, TREND_DIRECTION } from "../constants/index.js";

const pickBy = (results, compare) =>
  results.length ? [...results].sort(compare)[0].lang : null;

const langsWhere = (results, predicate) =>
  results.filter(predicate).map(({ lang }) => lang);

export const buildHighlights = (results) => {
  const reliable = results.filter(
    ({ confidence }) => confidence !== CONFIDENCE.LOW,
  );
  const growing = reliable.filter(
    ({ trend }) => trend === TREND_DIRECTION.GROWING,
  );
  const declining = reliable.filter(
    ({ trend }) => trend === TREND_DIRECTION.DECLINING,
  );
  const byGrowthDesc = (a, b) => b.trend_pct_per_year - a.trend_pct_per_year;
  const byGrowthAsc = (a, b) => a.trend_pct_per_year - b.trend_pct_per_year;
  const highlights = {
    largest_audience: pickBy(
      results,
      (a, b) => b.avg_monthly_views - a.avg_monthly_views,
    ),
    fastest_growth: pickBy(growing, byGrowthDesc),
    fastest_decline: pickBy(declining, byGrowthAsc),
    slowest_decline:
      declining.length > 1 ? pickBy(declining, byGrowthDesc) : null,
    no_clear_trend: langsWhere(
      results,
      ({ trend }) => trend === TREND_DIRECTION.NO_CLEAR_TREND,
    ),
    low_confidence: langsWhere(
      results,
      ({ confidence }) => confidence === CONFIDENCE.LOW,
    ),
  };

  return Object.fromEntries(
    Object.entries(highlights).filter(([, value]) =>
      Array.isArray(value) ? value.length : value,
    ),
  );
};
