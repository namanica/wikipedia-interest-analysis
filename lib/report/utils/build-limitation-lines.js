import { REPORT_LIMITS } from "../constants/index.js";

export const buildLimitationLines = ({ text, limitations }) => {
  const { general, ...byFlag } = limitations;
  const localized = text.LIMITATION;
  const flagLines = Object.entries(byFlag).map(
    ([flag, sentence]) => localized?.[flag.toUpperCase()] ?? sentence,
  );
  const generalLines = localized?.GENERAL ?? general;

  return [...flagLines, ...generalLines].slice(0, REPORT_LIMITS.LIMITATIONS);
};
