import { CONFIDENCE_RULE, SPIKE_RULE } from "./constants/index.js";

export const buildAssumptions = ({ period, raw, keepSpikes }) => ({
  period,
  normalization: raw ? "none" : "views per million views of the edition",
  spikes: keepSpikes
    ? "kept"
    : `removed: days over ${SPIKE_RULE.MIN_RATIO_TO_MEDIAN}x the ${SPIKE_RULE.WINDOW_DAYS}-day median`,
  trend_test: `seasonal Mann-Kendall + Sen's slope, p < ${CONFIDENCE_RULE.SIGNIFICANCE_LEVEL}`,
  traffic: "all devices, users only",
});
