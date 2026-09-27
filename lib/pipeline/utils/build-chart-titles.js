import { CHART_LABELS } from "#lib/charts/index.js";

export const buildChartTitles = ({ manifest, labels = CHART_LABELS.EN }) => {
  const { chart_data: series, assumptions } = manifest;
  const { start, end } = assumptions.period;
  const [first] = series;
  const title =
    series.length > 1
      ? labels.COMPARISON_TITLE
      : `"${first.article}", ${first.lang}.wikipedia`;

  return { title, subtitle: `${labels.SOURCE}, ${start} – ${end}` };
};
