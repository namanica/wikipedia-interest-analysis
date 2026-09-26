import {
  PAGEVIEWS_GRANULARITY,
  createRequestCounter,
} from "#lib/api/wikimedia/index.js";
import { buildAssumptions, buildLimitations } from "#lib/analysis/index.js";
import { createSeriesCache } from "#lib/cache/index.js";
import { loadDailySeries } from "./load-daily-series.js";
import {
  addTotalTargets,
  analyzeTargets,
  buildHints,
  buildTargets,
  parseYears,
  resolveFetchPeriod,
  summarizeResults,
} from "./utils/index.js";

export const analyzeInterest = async ({
  articles,
  start,
  end,
  years,
  raw = false,
  keepSpikes = false,
  cache = createSeriesCache(),
  fetch,
}) => {
  const articleTargets = buildTargets({ articles });
  const targets = addTotalTargets(articleTargets);
  const period = resolveFetchPeriod({
    start,
    end,
    years: parseYears(years),
    granularity: PAGEVIEWS_GRANULARITY.MONTHLY,
  });
  const counter = createRequestCounter();
  const series = await loadDailySeries({
    targets,
    period,
    cache,
    counter,
    fetch,
  });
  const { results, missing } = analyzeTargets({
    series,
    period,
    raw,
    keepSpikes,
  });

  return {
    summary:
      summarizeResults(results) || "No article had pageviews in the period.",
    data: {
      assumptions: buildAssumptions({ period, raw, keepSpikes }),
      results,
      limitations: buildLimitations(results),
    },
    hints: buildHints(missing),
    networkRequests: counter.count(),
  };
};
