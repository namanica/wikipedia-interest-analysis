import { SkillError } from "#lib/utils/index.js";

const LANG_PATTERN = /^[a-z][a-z-]*$/;

export const parseLang = (value) => {
  const lang = value.trim();

  if (!LANG_PATTERN.test(lang)) {
    throw new SkillError({
      message: `Invalid language code: ${value}`,
      hint: "Use a Wikipedia language code such as uk, pl or cs.",
    });
  }

  return lang;
};
