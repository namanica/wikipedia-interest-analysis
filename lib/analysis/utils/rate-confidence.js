import { BLOCKING_FLAGS, CONFIDENCE } from "../constants/index.js";

export const rateConfidence = (flags) => {
  if (flags.some((flag) => BLOCKING_FLAGS.includes(flag))) {
    return CONFIDENCE.LOW;
  }

  return flags.length ? CONFIDENCE.MEDIUM : CONFIDENCE.HIGH;
};
