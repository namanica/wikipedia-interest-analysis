export const trimLeadingZeros = (points) => {
  const firstIndex = points.findIndex(({ value }) => value > 0);

  return firstIndex < 0 ? [] : points.slice(firstIndex);
};
