import { toIsoDate } from "#lib/utils/index.js";

const MONTHS_PER_YEAR = 12;

export const toFullMonthsStart = (monthEnd, years) => {
  const end = new Date(monthEnd);
  const start = new Date(
    Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth() - years * MONTHS_PER_YEAR + 1,
      1,
    ),
  );

  return toIsoDate(start);
};
