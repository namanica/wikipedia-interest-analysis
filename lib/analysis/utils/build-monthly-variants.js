import { toMonthlyPoints } from "#lib/models/index.js";
import { normalizePoints } from "./normalize-points.js";
import { trimLeadingZeros } from "./trim-leading-zeros.js";

export const buildMonthlyVariants = ({ daily, cleaned, totalPoints }) => {
  const rawWithSpikes = trimLeadingZeros(toMonthlyPoints(daily));
  const firstMonth = rawWithSpikes[0]?.date;
  const rawClean = toMonthlyPoints(cleaned).filter(
    ({ date }) => date >= firstMonth,
  );
  const totals = toMonthlyPoints(totalPoints);

  return {
    rawWithSpikes,
    rawClean,
    normalizedWithSpikes: normalizePoints(rawWithSpikes, totals),
    normalizedClean: normalizePoints(rawClean, totals),
  };
};
