import { SkillError } from "#lib/utils/index.js";
import { parseArticleTarget } from "./parse-article-target.js";
import { parseLang } from "./parse-lang.js";

export const buildTargets = ({ articles = [], totals = [] }) => {
  const targets = [
    ...articles.map(parseArticleTarget),
    ...totals.map((lang) => ({ lang: parseLang(lang), article: null })),
  ];

  if (!targets.length) {
    throw new SkillError({
      message: "Nothing to fetch.",
      hint: 'Pass --article "uk:Астрономія" and/or --total uk.',
    });
  }

  return targets;
};
