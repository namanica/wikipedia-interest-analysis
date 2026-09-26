import { addDays } from "#lib/utils/index.js";

const FRESH_DAYS = 3;

export const splitByFreshness = ({ start, end }, today) => {
  const lastSettled = addDays(today, -FRESH_DAYS);
  const firstRecent = addDays(lastSettled, 1);
  const settledEnd = end < lastSettled ? end : lastSettled;
  const recentStart = start > firstRecent ? start : firstRecent;

  return {
    settled: start <= settledEnd ? [{ start, end: settledEnd }] : [],
    recent: recentStart <= end ? [{ start: recentStart, end }] : [],
  };
};
