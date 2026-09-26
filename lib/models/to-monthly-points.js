const YEAR_MONTH_LENGTH = 7;

export const toMonthlyPoints = (points) => {
  const totals = points.reduce((sums, { date, value }) => {
    const month = `${date.slice(0, YEAR_MONTH_LENGTH)}-01`;
    const total = sums.get(month) ?? 0;

    return sums.set(month, total + value);
  }, new Map());

  return [...totals].map(([date, value]) => ({ date, value }));
};
