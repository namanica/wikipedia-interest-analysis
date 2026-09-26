const byDate = (a, b) => a.date.localeCompare(b.date);

export const mergePoints = (current, incoming, { start, end }) => {
  const outside = current.filter(({ date }) => date < start || date > end);

  return [...outside, ...incoming].sort(byDate);
};
