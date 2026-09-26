import {
  CONFIDENCE_RULE,
  PERCENT,
  TREND_DIRECTION,
} from "../constants/index.js";
import { mean } from "./mean.js";
import { seasonalMannKendall } from "./seasonal-mann-kendall.js";
import { seasonalSensSlope } from "./seasonal-sens-slope.js";

const toDirection = (slope, pValue) => {
  if (pValue >= CONFIDENCE_RULE.SIGNIFICANCE_LEVEL || !slope) {
    return TREND_DIRECTION.NO_CLEAR_TREND;
  }

  return slope > 0 ? TREND_DIRECTION.GROWING : TREND_DIRECTION.DECLINING;
};

export const assessTrend = (points) => {
  const { pValue } = seasonalMannKendall(points);
  const slopePerYear = seasonalSensSlope(points);
  const average = mean(points.map(({ value }) => value));
  const pctPerYear = average ? (slopePerYear / average) * PERCENT : 0;

  return {
    direction: toDirection(slopePerYear, pValue),
    slopePerYear,
    pctPerYear,
    pValue,
  };
};
