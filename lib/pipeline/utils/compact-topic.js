const MAX_ALTERNATIVES = 3;
const MAX_LABEL_LENGTH = 60;

export const compactTopic = ({ topic, alternatives }) => ({
  topic: {
    qid: topic.qid,
    label: topic.label,
    description: topic.description,
    missing_langs: topic.articles
      .filter(({ title }) => !title)
      .map(({ lang }) => lang),
  },
  alternatives: alternatives
    .slice(0, MAX_ALTERNATIVES)
    .map(({ qid, label }) => ({
      qid,
      label: label?.slice(0, MAX_LABEL_LENGTH) ?? null,
    })),
});
