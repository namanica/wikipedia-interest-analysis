import {
  PAGEVIEWS_GRANULARITY,
  fetchPageviewsBatch,
} from "#lib/api/wikimedia/index.js";
import {
  findMissingRequests,
  readCachedSeries,
  storeFetchedSeries,
} from "./utils/index.js";

export const loadDailySeries = async ({
  targets,
  period,
  cache,
  counter,
  fetch,
}) => {
  const requests = await findMissingRequests({ targets, period, cache });
  const fetched = await fetchPageviewsBatch({
    requests,
    granularity: PAGEVIEWS_GRANULARITY.DAILY,
    counter,
    fetch,
  });

  await storeFetchedSeries({ requests, fetched, cache });

  return readCachedSeries({ targets, period, cache });
};
