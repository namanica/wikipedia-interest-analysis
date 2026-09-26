const MONTH_START = 5;
const MONTH_END = 7;
const YEAR_LENGTH = 4;

export const groupBySeason = (points) =>
  Object.values(
    points.reduce((seasons, { date, value }) => {
      const month = date.slice(MONTH_START, MONTH_END);
      const year = Number(date.slice(0, YEAR_LENGTH));
      const season = seasons[month] ?? [];

      return { ...seasons, [month]: [...season, { year, value }] };
    }, {}),
  );
