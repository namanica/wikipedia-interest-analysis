const HALF = 2;

export const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / HALF);

  return sorted.length % HALF
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / HALF;
};
