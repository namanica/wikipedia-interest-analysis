import { addDays } from "#lib/utils/index.js";

export const buildDailyPoints = ({ start, end, value }) => {
  const points = [];

  for (let date = start, index = 0; date <= end; date = addDays(date, 1)) {
    points.push({ date, value: value(date, index) });
    index += 1;
  }

  return points;
};

export const buildMonthlyPoints = ({ startYear, months, value }) =>
  Array.from({ length: months }, (_, index) => {
    const year = startYear + Math.floor(index / 12);
    const month = (index % 12) + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-01`;

    return { date, value: value(index, month) };
  });

export const monthIndexOf = (date, startYear) =>
  (Number(date.slice(0, 4)) - startYear) * 12 + Number(date.slice(5, 7)) - 1;

export const seasonal = (month) =>
  1 + 0.3 * Math.sin((month / 12) * 2 * Math.PI);

export const noise = (index) => {
  const x = Math.sin((index + 1) * 12.9898) * 43758.5453;

  return (x - Math.floor(x) - 0.5) * 10;
};
