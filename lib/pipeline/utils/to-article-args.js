export const toArticleArgs = (topic) =>
  topic.articles
    .filter(({ title }) => title)
    .map(({ lang, title }) => `${lang}:${title}`);
