const MAX_ALTERNATIVES = 3;
const MAX_TEXT_LENGTH = 60;

const shorten = (text) => text?.slice(0, MAX_TEXT_LENGTH) ?? null;

export const compactTopic = ({ topic, alternatives, broader = [] }) => ({
  topic: {
    qid: topic.qid,
    label: topic.label,
    description: topic.description,
    missing_langs: topic.articles
      .filter(({ title }) => !title)
      .map(({ lang }) => lang),
    ...(broader.length ? { broader_topics: broader } : {}),
  },
  alternatives: alternatives
    .slice(0, MAX_ALTERNATIVES)
    .map(({ qid, label, description }) => ({
      qid,
      label: shorten(label),
      description: shorten(description),
    })),
});
