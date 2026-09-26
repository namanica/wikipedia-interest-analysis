import { addDays } from "#lib/utils/index.js";

export const fillDailyGaps = (points, { start, end }) => {
  const values = new Map(points.map(({ date, value }) => [date, value]));
  const filled = [];

  for (let date = start; date <= end; date = addDays(date, 1)) {
    filled.push({ date, value: values.get(date) ?? 0 });
  }

  return filled;
};
