const ARTICLE_STATUS = { FOUND: "found", MISSING: "missing" };

export const buildTopic = ({ entity, langs }) => ({
  qid: entity.qid,
  label: entity.label,
  description: entity.description,
  articles: langs.map((lang) => {
    const title = entity.titles[lang] ?? null;
    const status = title ? ARTICLE_STATUS.FOUND : ARTICLE_STATUS.MISSING;

    return { lang, title, status };
  }),
});
