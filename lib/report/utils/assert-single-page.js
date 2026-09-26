import { SkillError } from "#lib/utils/index.js";

export const assertSinglePage = (doc) => {
  const { count } = doc.bufferedPageRange();

  if (count > 1) {
    throw new SkillError({
      message: `The report needs ${count} pages instead of 1.`,
      hint: "Shorten --summary and --next (2-3 sentences each) or compare fewer languages, then rerun build-report.js.",
    });
  }
};
