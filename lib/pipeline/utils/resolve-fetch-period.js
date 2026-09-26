import { DEFAULT_PERIOD_YEARS, resolvePeriod } from "#lib/utils/index.js";
import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";
import { alignToMonths } from "./align-to-months.js";
import { toFullMonthsStart } from "./to-full-months-start.js";

export const resolveFetchPeriod = ({
  start,
  end,
  years = DEFAULT_PERIOD_YEARS,
  granularity,
}) => {
  const period = resolvePeriod({ start, end, years });

  if (granularity !== PAGEVIEWS_GRANULARITY.MONTHLY) {
    return period;
  }

  const aligned = alignToMonths(period);

  return start
    ? aligned
    : { ...aligned, start: toFullMonthsStart(aligned.end, years) };
};
