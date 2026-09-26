import { MONTHS_PER_YEAR, PERCENT } from "../constants/index.js";
import { mean } from "./mean.js";
import { pickTopSpikes } from "./pick-top-spikes.js";
import { roundTo } from "./round-to.js";

const PCT_DIGITS = 1;
const RATE_DIGITS = 2;
const P_VALUE_DIGITS = 3;

export const formatArticleResult = ({
  lang,
  article,
  facts,
  metrics,
  flags,
  confidence,
}) => {
  const { trend, spikes } = facts;
  const lastYearRate = mean(
    metrics.normalized.slice(-MONTHS_PER_YEAR).map(({ value }) => value),
  );

  return {
    lang,
    article,
    first_month: facts.firstMonth,
    months: facts.months,
    avg_monthly_views: Math.round(facts.avgMonthlyViews),
    views_per_million: roundTo(lastYearRate, RATE_DIGITS),
    trend: trend.direction,
    trend_pct_per_year: roundTo(trend.pctPerYear, PCT_DIGITS),
    p_value: roundTo(trend.pValue, P_VALUE_DIGITS),
    yoy_growth_pct: roundTo(metrics.yoy, PCT_DIGITS),
    yoy_views_growth_pct: roundTo(metrics.yoyViews, PCT_DIGITS),
    index_last_12m: roundTo(metrics.index, PCT_DIGITS),
    spike_share_pct: roundTo(facts.spikeShare * PERCENT, PCT_DIGITS),
    top_spikes: pickTopSpikes(spikes),
    confidence,
    flags,
  };
};
