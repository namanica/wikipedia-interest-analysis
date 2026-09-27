const describeLang = ({ lang, flags }, text) => {
  const reasons = flags.map((flag) => text.FLAG_REASON[flag.toUpperCase()]);

  return reasons.length ? `${lang} (${reasons.join(", ")})` : lang;
};

export const buildConfidenceLines = ({ text, rows }) =>
  Object.entries(Object.groupBy(rows, ({ confidence }) => confidence)).map(
    ([confidence, group]) => {
      const level = text.LEVEL[confidence.toUpperCase()];
      const langs = group.map((row) => describeLang(row, text)).join(", ");
      const hasFlags = group.some(({ flags }) => flags.length);
      const note = hasFlags ? "" : ` — ${text.NO_FLAGS}`;

      return `${level}: ${langs}${note}`;
    },
  );
