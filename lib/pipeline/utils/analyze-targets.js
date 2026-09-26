import { analyzeSeries } from "#lib/analysis/index.js";

export const analyzeTargets = ({ series, period, raw, keepSpikes }) => {
  const totalsByLang = new Map(
    series
      .filter(({ article }) => !article)
      .map(({ lang, points }) => [lang, points]),
  );
  const articleSeries = series.filter(({ article }) => article);
  const withData = articleSeries.filter(({ points }) => points.length);

  return {
    results: withData.map(({ lang, article, points }) =>
      analyzeSeries({
        lang,
        article,
        articlePoints: points,
        totalPoints: totalsByLang.get(lang),
        period,
        raw,
        keepSpikes,
      }),
    ),
    missing: articleSeries.filter(({ points }) => !points.length),
  };
};
