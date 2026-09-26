const BASE = 10;

export const roundTo = (value, digits) => {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }

  const factor = BASE ** digits;

  return Math.round(value * factor) / factor;
};
