const PCT_DIGITS = 1;

export const formatNumber = (value, locale, { signed = false } = {}) => {
  if (value === null || value === undefined) {
    return "—";
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: PCT_DIGITS,
    signDisplay: signed ? "exceptZero" : "auto",
  });

  return formatter.format(value);
};
