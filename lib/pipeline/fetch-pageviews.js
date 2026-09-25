import {
  PAGEVIEWS_GRANULARITY,
  createRequestCounter,
  fetchPageviewsBatch,
} from "#lib/api/wikimedia/index.js";
import {
  assertGranularity,
  buildHints,
  buildTargets,
  resolveFetchPeriod,
  summarizeSeries,
} from "./utils/index.js";

export const fetchPageviews = async ({
  articles,
  totals,
  granularity = PAGEVIEWS_GRANULARITY.DAILY,
  start,
  end,
  fetch,
}) => {
  const targets = buildTargets({ articles, totals });
  assertGranularity(granularity);
  const period = resolveFetchPeriod({ start, end, granularity });
  const counter = createRequestCounter();
  const series = await fetchPageviewsBatch({
    targets,
    granularity,
    ...period,
    counter,
    fetch,
  });

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
