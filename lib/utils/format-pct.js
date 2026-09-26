export const formatPct = (value) => {
  if (value === null || value === undefined) {
    return "n/a";
  }

  return value > 0 ? `+${value}%` : `${value}%`;
};
