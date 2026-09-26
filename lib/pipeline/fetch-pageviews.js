import {
  PAGEVIEWS_GRANULARITY,
  createRequestCounter,
} from "#lib/api/wikimedia/index.js";
import { createSeriesCache } from "#lib/cache/index.js";
import { loadDailySeries } from "./load-daily-series.js";
import {
  assertGranularity,
  buildHints,
  buildTargets,
  parseYears,
  resolveFetchPeriod,
  summarizeSeries,
  toMonthlySeries,
} from "./utils/index.js";

export const fetchPageviews = async ({
  articles,
  totals,
  granularity = PAGEVIEWS_GRANULARITY.DAILY,
  start,
  end,
  years,
  cache = createSeriesCache(),
  fetch,
}) => {
  const targets = buildTargets({ articles, totals });
  assertGranularity(granularity);
  const period = resolveFetchPeriod({
    start,
    end,
    years: parseYears(years),
    granularity,
  });
  const counter = createRequestCounter();
  const dailySeries = await loadDailySeries({
    targets,
    period,
    cache,
    counter,
    fetch,
  });
  const series =
    granularity === PAGEVIEWS_GRANULARITY.MONTHLY
      ? dailySeries.map(toMonthlySeries)
      : dailySeries;

  return {
    summary: `Fetched ${series.length} series (${granularity}, ${period.start}..${period.end}).`,
    data: {
      period,
      granularity,
      series: series.map(summarizeSeries),
    },
    hints: buildHints(series),
    networkRequests: counter.count(),
  };
};
