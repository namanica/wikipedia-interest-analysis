import { SkillError } from "./skill-error.js";
import { toIsoDate } from "./to-iso-date.js";

const DEFAULT_PERIOD_YEARS = 3;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseIsoDate = (value) => {
  const date = new Date(value);
  const isValid =
    ISO_DATE_PATTERN.test(value) &&
    !Number.isNaN(date.getTime()) &&
    toIsoDate(date) === value;

  if (!isValid) {
    throw new SkillError({
      message: `Invalid date: ${value}`,
      hint: "Use the YYYY-MM-DD format, for example 2024-01-31.",
    });
  }

  return date;
};

const shiftDate = (date, { years = 0, days = 0 }) => {
  const shifted = new Date(date);

  shifted.setUTCFullYear(
    shifted.getUTCFullYear() + years,
    shifted.getUTCMonth(),
    shifted.getUTCDate() + days,
  );

  return shifted;
};

export const resolvePeriod = ({ start, end, now = new Date() }) => {
  const endDate = end ? parseIsoDate(end) : shiftDate(now, { days: -1 });
  const startDate = start
    ? parseIsoDate(start)
    : shiftDate(endDate, { years: -DEFAULT_PERIOD_YEARS, days: 1 });

  if (startDate > endDate) {
    throw new SkillError({
      message: "The start date is after the end date.",
      hint: "Pass a --start date earlier than --end.",
    });
  }

  return { start: toIsoDate(startDate), end: toIsoDate(endDate) };
};
