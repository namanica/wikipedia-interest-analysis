export const buildHints = (series) =>
  series
    .filter(({ points }) => !points.length)
    .map(({ lang, article }) =>
      article
        ? `No pageviews for "${article}" in ${lang}.wikipedia. Check the exact title (case-sensitive) and the language code.`
        : `No pageviews for ${lang}.wikipedia. Check the language code.`,
    );
