export const buildAssumptionLines = ({ text, period, raw, keepSpikes }) => [
  text.PERIOD(period.start, period.end),
  raw ? text.RAW : text.NORMALIZED,
  keepSpikes ? text.SPIKES_KEPT : text.SPIKES_REMOVED,
  text.TREND_TEST,
  text.TRAFFIC,
];
