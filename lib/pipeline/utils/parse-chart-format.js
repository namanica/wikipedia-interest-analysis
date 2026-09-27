import { CHART_FORMAT } from "#lib/charts/index.js";
import { SkillError } from "#lib/utils/index.js";

export const parseChartFormat = (value = CHART_FORMAT.PNG) => {
  const format = value.trim().toLowerCase();
  const formats = Object.values(CHART_FORMAT);

  if (!formats.includes(format)) {
    throw new SkillError({
      message: `Chart format "${value}" is not supported.`,
      hint: `Charts are available only as ${formats.join(" or ")}. Tell the user so and offer one of them.`,
    });
  }

  return format;
};
