import { FLAG_LIMITATION, GENERAL_LIMITATIONS } from "./constants/index.js";

export const buildLimitations = (results) => {
  const flags = [...new Set(results.flatMap(({ flags }) => flags))];

  return {
    general: GENERAL_LIMITATIONS,
    ...Object.fromEntries(flags.map((flag) => [flag, FLAG_LIMITATION[flag]])),
  };
};
