import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";
import { toMonthlyPoints } from "#lib/models/index.js";

export const toMonthlySeries = (series) => {
  const points = toMonthlyPoints(series.points);

  return { ...series, granularity: PAGEVIEWS_GRANULARITY.MONTHLY, points };
};
