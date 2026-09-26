import { CONFIDENCE_RULE, FLAG, TREND_DIRECTION } from "../constants/index.js";

const RULES = [
  [
    FLAG.VERY_LOW_VOLUME,
    ({ avgMonthlyViews }) =>
      avgMonthlyViews < CONFIDENCE_RULE.VERY_LOW_MONTHLY_VIEWS,
  ],
  [
    FLAG.LOW_VOLUME,
    ({ avgMonthlyViews }) =>
      avgMonthlyViews >= CONFIDENCE_RULE.VERY_LOW_MONTHLY_VIEWS &&
      avgMonthlyViews < CONFIDENCE_RULE.MIN_MONTHLY_VIEWS,
  ],
  [
    FLAG.VERY_SHORT_HISTORY,
    ({ months }) => months < CONFIDENCE_RULE.VERY_SHORT_MONTHS,
  ],
  [
    FLAG.SHORT_HISTORY,
    ({ months }) =>
      months >= CONFIDENCE_RULE.VERY_SHORT_MONTHS &&
      months < CONFIDENCE_RULE.MIN_MONTHS,
  ],
  [FLAG.LATE_START, ({ lateStart }) => lateStart],
  [
    FLAG.SPIKE_DRIVEN,
    ({ trend, trendWithSpikes }) =>
      trendWithSpikes.direction !== TREND_DIRECTION.NO_CLEAR_TREND &&
      trendWithSpikes.direction !== trend.direction,
  ],
  [
    FLAG.SPIKE_HEAVY,
    ({ spikeShare }) => spikeShare > CONFIDENCE_RULE.MAX_SPIKE_SHARE,
  ],
  [
    FLAG.UNSTABLE_TREND,
    ({ stability }) => stability.agreeing < stability.checked,
  ],
  [
    FLAG.NOT_SIGNIFICANT,
    ({ trend }) => trend.direction === TREND_DIRECTION.NO_CLEAR_TREND,
  ],
  [
    FLAG.RAW_NORMALIZED_DISAGREE,
    ({ rawTrend, normalizedTrend }) =>
      rawTrend.direction !== normalizedTrend.direction,
  ],
];

export const collectFlags = (facts) =>
  RULES.filter(([, check]) => check(facts)).map(([flag]) => flag);
