import { SkillError, toIsoDate } from "#lib/utils/index.js";

const toMonthStart = (isoDate) => {
  const date = new Date(isoDate);

  return date.getUTCDate() === 1
    ? date
    : new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
};

const toMonthEnd = (isoDate) => {
  const date = new Date(isoDate);
  const nextDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
  );

  return nextDay.getUTCDate() === 1
    ? date
    : new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 0));
};

export const alignToMonths = ({ start, end }) => {
  const monthStart = toMonthStart(start);
  const monthEnd = toMonthEnd(end);

  if (monthStart > monthEnd) {
    throw new SkillError({
      message: `The period ${start}..${end} contains no full calendar month.`,
      hint: "Use --granularity daily or a longer period.",
    });
  }

  return { start: toIsoDate(monthStart), end: toIsoDate(monthEnd) };
};
