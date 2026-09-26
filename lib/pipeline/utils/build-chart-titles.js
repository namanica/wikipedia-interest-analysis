import { CHART_LABELS } from "#lib/charts/index.js";

export const buildChartTitles = ({ manifest, labels = CHART_LABELS.EN }) => {
  const { topic, chart_data: series, assumptions } = manifest;
  const { start, end } = assumptions.period;
  const title =
    series.length > 1
      ? topic.label
      : `${topic.label}: ${series[0].lang}.wikipedia, "${series[0].article}"`;

  return { title, subtitle: `${labels.SOURCE}, ${start} – ${end}` };
};
