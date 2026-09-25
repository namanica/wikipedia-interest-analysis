import { SkillError } from "#lib/utils/index.js";
import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";

export const assertGranularity = (granularity) => {
  const allowed = Object.values(PAGEVIEWS_GRANULARITY);

  if (!allowed.includes(granularity)) {
    throw new SkillError({
      message: `Invalid granularity: ${granularity}`,
      hint: `Use one of: ${allowed.join(", ")}.`,
    });
  }
};
