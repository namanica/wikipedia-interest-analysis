import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";
import { buildCacheKey } from "./build-cache-key.js";

export const readCachedSeries = ({ targets, period, cache }) =>
  Promise.all(
    targets.map(async ({ lang, article }) => {
      const key = buildCacheKey({ lang, article });
      const points = await cache.get(key, period);

      return {
        lang,
        article,
        granularity: PAGEVIEWS_GRANULARITY.DAILY,
        points,
      };
    }),
  );
