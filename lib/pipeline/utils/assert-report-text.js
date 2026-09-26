import { REPORT_LIMITS } from "#lib/report/index.js";
import { SkillError } from "#lib/utils/index.js";

const assertLength = (name, value, limit) => {
  if (value && value.length > limit) {
    throw new SkillError({
      message: `--${name} is ${value.length} characters, the limit is ${limit}.`,
      hint: `Shorten --${name} to fit a one-page report (2-3 sentences).`,
    });
  }
};

export const assertReportText = ({ summary, question, next }) => {
  if (!summary?.trim()) {
    throw new SkillError({
      message: "--summary is required.",
      hint: 'Pass the 2-3 sentence conclusion you gave the user, in their language: --summary "..."',
    });
  }

  assertLength("summary", summary, REPORT_LIMITS.SUMMARY_CHARS);
  assertLength("question", question, REPORT_LIMITS.QUESTION_CHARS);
  assertLength("next", next, REPORT_LIMITS.NEXT_CHARS);
};
