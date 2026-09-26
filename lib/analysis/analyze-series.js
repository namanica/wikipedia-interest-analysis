import {
  assessStability,
  assessTrend,
  buildChartData,
  buildMonthlyVariants,
  collectFlags,
  computeIndex,
  computeYoy,
  detectSpikes,
  fillDailyGaps,
  formatArticleResult,
  mean,
  pickVariant,
  rateConfidence,
  sumValues,
} from "./utils/index.js";

export const analyzeSeries = ({
  lang,
  article,
  articlePoints,
  totalPoints,
  period,
  raw = false,
  keepSpikes = false,
}) => {
  const daily = fillDailyGaps(articlePoints, period);
  const { cleaned, spikes } = detectSpikes(daily);
  const variants = buildMonthlyVariants({ daily, cleaned, totalPoints });
  const selected = pickVariant(variants, { raw, keepSpikes });
  const trend = assessTrend(selected);
  const totalViews = sumValues(daily);
  const facts = {
    firstMonth: variants.rawWithSpikes[0].date,
    months: selected.length,
    lateStart: variants.rawWithSpikes[0].date > period.start,
    avgMonthlyViews: mean(variants.rawWithSpikes.map(({ value }) => value)),
    spikes,
    spikeShare: totalViews ? (totalViews - sumValues(cleaned)) / totalViews : 0,
    trend,
    trendWithSpikes: assessTrend(
      pickVariant(variants, { raw, keepSpikes: true }),
    ),
    rawTrend: assessTrend(pickVariant(variants, { raw: true, keepSpikes })),
    normalizedTrend: assessTrend(
      pickVariant(variants, { raw: false, keepSpikes }),
    ),
    stability: assessStability(selected, trend.direction),
  };
  const metrics = {
    normalized: variants.normalizedClean,
    yoy: computeYoy(selected),
    yoyViews: computeYoy(variants.rawWithSpikes),
    index: computeIndex(selected),
  };
  const flags = collectFlags(facts);
  const confidence = rateConfidence(flags);

  return {
    result: formatArticleResult({
      lang,
      article,
      facts,
      metrics,
      flags,
      confidence,
    }),
    chart: buildChartData({ lang, article, selected, trend, spikes }),
  };
};
