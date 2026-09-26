import { CONFIDENCE_RULE, STABILITY_SHIFT_MONTHS } from "../constants/index.js";
import { assessTrend } from "./assess-trend.js";

export const assessStability = (points, direction) => {
  const variants = Object.values(STABILITY_SHIFT_MONTHS)
    .map((shift) => points.slice(shift))
    .filter((variant) => variant.length >= CONFIDENCE_RULE.MIN_MONTHS)
    .map((variant) => assessTrend(variant).direction);

  return {
    checked: variants.length,
    agreeing: variants.filter((item) => item === direction).length,
  };
};
