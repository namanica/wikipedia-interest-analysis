export const describeRun = ({ assumptions, params, chart_data: series }) => {
  const { start, end } = assumptions.period;
  const values = params.raw ? "raw monthly views" : "normalized views";
  const spikes = params.keepSpikes ? "spikes kept" : "spikes removed";
  const shows =
    series.length > 1
      ? "one index line per language (first 12 months = 100)"
      : "monthly values with the trend line and spike days";

  return { variant: `${start} – ${end}, ${values}, ${spikes}`, shows };
};
