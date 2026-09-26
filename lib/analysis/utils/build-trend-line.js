import { MONTHS_PER_YEAR } from "../constants/index.js";
import { median } from "./median.js";

export const buildTrendLine = (points, slopePerYear) => {
  const slopePerMonth = slopePerYear / MONTHS_PER_YEAR;
  const intercept = median(
    points.map(({ value }, index) => value - slopePerMonth * index),
  );
  const lastIndex = points.length - 1;

  return [
    { date: points[0].date, value: intercept },
    {
      date: points[lastIndex].date,
      value: intercept + slopePerMonth * lastIndex,
    },
  ];
};
