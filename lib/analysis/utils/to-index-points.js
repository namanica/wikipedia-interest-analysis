import { MONTHS_PER_YEAR, PERCENT } from "../constants/index.js";
import { mean } from "./mean.js";

export const toIndexPoints = (points) => {
  const base = mean(points.slice(0, MONTHS_PER_YEAR).map(({ value }) => value));

  return points.map(({ date, value }) => ({
    date,
    value: base ? (value / base) * PERCENT : 0,
  }));
};
