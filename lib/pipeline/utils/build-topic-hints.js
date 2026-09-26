export const buildTopicHints = ({ topic, alternatives }) => {
  const missing = topic.articles.filter(({ title }) => !title);

  return [
    ...(alternatives.length
      ? [
          `Resolved to ${topic.qid} (${topic.description ?? topic.label}). If the user meant another topic, rerun with --qid <id> from alternatives.`,
        ]
      : []),
    ...missing.map(
      ({ lang }) =>
        `No ${lang}.wikipedia article about "${topic.label}": interest in ${lang} cannot be measured with this topic. Check the language code or try a broader topic.`,
    ),
  ];
};
