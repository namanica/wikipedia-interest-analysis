export const buildTopicHints = ({ topic, alternatives }) => {
  const found = topic.articles.filter(({ title }) => title);
  const missing = topic.articles.filter(({ title }) => !title);
  const articleArgs = found
    .map(({ lang, title }) => `--article "${lang}:${title}"`)
    .join(" ");

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
    ...(found.length
      ? [`Next: node scripts/analyze-interest.js ${articleArgs}`]
      : []),
  ];
};
