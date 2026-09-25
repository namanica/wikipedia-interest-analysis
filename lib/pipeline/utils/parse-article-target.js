import { SkillError } from "#lib/utils/index.js";
import { parseLang } from "./parse-lang.js";

export const parseArticleTarget = (value) => {
  const separatorIndex = value.indexOf(":");
  const article = value.slice(separatorIndex + 1).trim();

  if (separatorIndex < 0 || !article) {
    throw new SkillError({
      message: `Invalid --article value: ${value}`,
      hint: 'Use --article <lang>:<title>, for example --article "uk:Астрономія".',
    });
  }

  return { lang: parseLang(value.slice(0, separatorIndex)), article };
};
