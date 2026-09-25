import { resolvePeriod } from "#lib/utils/index.js";
import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";
import { alignToMonths } from "./align-to-months.js";

export const resolveFetchPeriod = ({ start, end, granularity }) => {
  const period = resolvePeriod({ start, end });

  return granularity === PAGEVIEWS_GRANULARITY.MONTHLY
    ? alignToMonths(period)
    : period;
};
