import { buildCacheKey } from "./build-cache-key.js";

export const findMissingRequests = async ({ targets, period, cache }) => {
  const requestsByTarget = await Promise.all(
    targets.map(async (target) => {
      const key = buildCacheKey(target);
      const ranges = await cache.missingRanges(key, period);

      return ranges.map((range) => ({ ...target, ...range }));
    }),
  );

  return requestsByTarget.flat();
};
