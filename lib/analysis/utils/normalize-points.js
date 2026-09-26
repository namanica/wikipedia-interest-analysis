const PER_MILLION = 1000000;

export const normalizePoints = (points, totals) => {
  const totalByDate = new Map(totals.map(({ date, value }) => [date, value]));

  return points.map(({ date, value }) => {
    const total = totalByDate.get(date);

    return { date, value: total ? (value / total) * PER_MILLION : 0 };
  });
};
