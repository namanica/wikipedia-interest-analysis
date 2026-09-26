import { toIsoDate } from "#lib/utils/index.js";

export const addDays = (isoDate, days) => {
  const date = new Date(isoDate);

  date.setUTCDate(date.getUTCDate() + days);

  return toIsoDate(date);
};
