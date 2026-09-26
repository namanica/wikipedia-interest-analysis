const TOP_SPIKES = 3;

const byExcess = (a, b) => b.value - b.expected - (a.value - a.expected);

export const pickTopSpikes = (spikes) =>
  [...spikes]
    .sort(byExcess)
    .slice(0, TOP_SPIKES)
    .map(({ date }) => date);
