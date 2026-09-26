import { buildCacheKey } from "./build-cache-key.js";

export const storeFetchedSeries = async ({ requests, fetched, cache }) => {
  for (const [index, request] of requests.entries()) {
    const key = buildCacheKey(request);
    const { start, end } = request;
    const { points } = fetched[index];

    await cache.set(key, { start, end, points });
  }
};
