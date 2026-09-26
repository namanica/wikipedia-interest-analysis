import { SkillError } from "#lib/utils/index.js";

const MAX_YEARS = 10;

export const parseYears = (value) => {
  if (value === undefined) {
    return undefined;
  }

  const years = Number(value);

  if (!Number.isInteger(years) || years < 1 || years > MAX_YEARS) {
    throw new SkillError({
      message: `Invalid number of years: ${value}`,
      hint: `Use a whole number from 1 to ${MAX_YEARS} (Pageviews data starts in July 2015).`,
    });
  }

  return years;
};
