import { CONFIDENCE_RULE } from "./confidence-rule.js";
import { FLAG } from "./flag.js";
import { PERCENT } from "./percent.js";

const {
  VERY_LOW_MONTHLY_VIEWS,
  MIN_MONTHLY_VIEWS,
  VERY_SHORT_MONTHS,
  MIN_MONTHS,
  SIGNIFICANCE_LEVEL,
  MAX_SPIKE_SHARE,
} = CONFIDENCE_RULE;

export const FLAG_LIMITATION = {
  [FLAG.VERY_LOW_VOLUME]: `Fewer than ${VERY_LOW_MONTHLY_VIEWS} views per month: random noise can outweigh any trend, so treat the numbers as anecdotal.`,
  [FLAG.LOW_VOLUME]: `Fewer than ${MIN_MONTHLY_VIEWS} views per month: percentages swing a lot on small counts.`,
  [FLAG.VERY_SHORT_HISTORY]: `Less than ${VERY_SHORT_MONTHS} months of data: seasonality cannot be separated from the trend.`,
  [FLAG.SHORT_HISTORY]: `Less than ${MIN_MONTHS} months of data: year-over-year growth is not available and the trend test is weak.`,
  [FLAG.LATE_START]:
    "The article has no views at the start of the period: it was probably created or renamed then, and views under an old title are not counted.",
  [FLAG.SPIKE_DRIVEN]:
    "The trend depends on a few spike days (news, TV, viral links): without them the direction changes.",
  [FLAG.SPIKE_HEAVY]: `More than ${MAX_SPIKE_SHARE * PERCENT}% of views came on spike days: interest is event-driven rather than steady.`,
  [FLAG.UNSTABLE_TREND]:
    "The trend direction changes when the start of the period is moved by a few months.",
  [FLAG.NOT_SIGNIFICANT]: `The change is not statistically significant (seasonal Mann-Kendall, p >= ${SIGNIFICANCE_LEVEL}): it may be noise.`,
  [FLAG.RAW_NORMALIZED_DISAGREE]:
    "Raw views and views normalized by the whole language edition point in different directions: part of the change is general Wikipedia traffic, not the topic.",
};
