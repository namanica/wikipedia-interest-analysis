import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";

const YEAR_MONTH_LENGTH = 7;

const sumByMonth = (points) =>
  points.reduce((totals, { date, value }) => {
    const month = `${date.slice(0, YEAR_MONTH_LENGTH)}-01`;
    const total = totals.get(month) ?? 0;

    return totals.set(month, total + value);
  }, new Map());

export const toMonthlySeries = (series) => {
  const totals = sumByMonth(series.points);
  const points = [...totals].map(([date, value]) => ({ date, value }));

  return { ...series, granularity: PAGEVIEWS_GRANULARITY.MONTHLY, points };
};
