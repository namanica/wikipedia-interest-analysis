import { MONTHS_PER_YEAR, PERCENT } from "../constants/index.js";
import { mean } from "./mean.js";

const COMPARED_YEARS = 2;

export const computeYoy = (points) => {
  if (points.length < MONTHS_PER_YEAR * COMPARED_YEARS) {
    return null;
  }

  const values = points.map(({ value }) => value);
  const lastYear = mean(values.slice(-MONTHS_PER_YEAR));
  const previousYear = mean(
    values.slice(-MONTHS_PER_YEAR * COMPARED_YEARS, -MONTHS_PER_YEAR),
  );

  return previousYear ? (lastYear / previousYear - 1) * PERCENT : null;
};
