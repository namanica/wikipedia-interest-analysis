import { SkillError } from "#lib/utils/index.js";
import { parseLang } from "./parse-lang.js";

export const parseLangList = (value = "") => {
  const langs = value
    .split(",")
    .filter((lang) => lang.trim())
    .map(parseLang);

  if (!langs.length) {
    throw new SkillError({
      message: "No languages given.",
      hint: "Pass --langs with Wikipedia language codes, for example --langs pl,cs.",
    });
  }

  return [...new Set(langs)];
};
