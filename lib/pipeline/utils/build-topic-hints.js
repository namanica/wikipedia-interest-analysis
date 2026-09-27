const describeBroader = (broader, lang) => {
  const match = broader.find(({ langs }) => langs.includes(lang));

  return match
    ? `A broader topic, "${match.label}" (${match.qid}), has an article in ${lang}: offer the user to measure it with --qid ${match.qid}, and say it measures interest in the broader topic.`
    : "Say plainly that it cannot be measured, and offer a related topic or other languages.";
};

export const buildTopicHints = ({ topic, alternatives, broader = [] }) => {
  const missing = topic.articles.filter(({ title }) => !title);

  return [
    ...(alternatives.length
      ? [
          `Resolved to ${topic.qid} (${topic.description ?? topic.label}). If this is not what the user means, ask which topic they mean (describe the alternatives in words), then rerun with --qid <id>.`,
        ]
      : []),
    ...missing.map(
      ({ lang }) =>
        `No ${lang}.wikipedia article about "${topic.label}": interest in ${lang} cannot be measured with this topic. ${describeBroader(broader, lang)}`,
    ),
  ];
};
