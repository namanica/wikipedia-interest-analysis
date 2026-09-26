export const buildConfidenceLines = ({ text, rows }) =>
  rows.map(({ lang, confidence, flags }) =>
    text.CONFIDENCE_LINE(lang, text.LEVEL[confidence.toUpperCase()], flags),
  );
