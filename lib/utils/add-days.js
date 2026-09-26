import { toIsoDate } from "./to-iso-date.js";

export const addDays = (isoDate, days) => {
  const date = new Date(isoDate);

  date.setUTCDate(date.getUTCDate() + days);

  return toIsoDate(date);
};
