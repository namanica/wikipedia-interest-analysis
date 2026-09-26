import { MONTHS_PER_YEAR, PERCENT } from "../constants/index.js";
import { mean } from "./mean.js";

const COMPARED_YEARS = 2;

export const computeIndex = (points) => {
  if (points.length < MONTHS_PER_YEAR * COMPARED_YEARS) {
    return null;
  }

  const values = points.map(({ value }) => value);
  const base = mean(values.slice(0, MONTHS_PER_YEAR));
  const last = mean(values.slice(-MONTHS_PER_YEAR));

  return base ? (last / base) * PERCENT : null;
};
