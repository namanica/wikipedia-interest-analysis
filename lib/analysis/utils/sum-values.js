export const sumValues = (points) =>
  points.reduce((sum, { value }) => sum + value, 0);
