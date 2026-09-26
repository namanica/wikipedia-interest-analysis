import { SkillError } from "#lib/utils/index.js";

const QID_PATTERN = /^Q\d+$/;

export const parseQid = (value) => {
  const qid = value.trim().toUpperCase();

  if (!QID_PATTERN.test(qid)) {
    throw new SkillError({
      message: `Invalid Wikidata id: ${value}`,
      hint: "Use an id such as Q333 from the alternatives list.",
    });
  }

  return qid;
};
