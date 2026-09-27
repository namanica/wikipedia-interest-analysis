import { SkillError } from "#lib/utils/index.js";

export const assertSinglePage = (doc) => {
  const { count } = doc.bufferedPageRange();

  if (count > 1) {
    throw new SkillError({
      message: `The report needs ${count} pages instead of 1.`,
      hint: "Shorten --summary to 2-3 sentences (about 300 characters) and --next to one sentence, then rerun build-report.js.",
    });
  }
};
