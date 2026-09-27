const MAX_FULL_RESULTS = 3;
const MAX_COMPACT_RESULTS = 6;
const COMPACT_FIELDS = [
  "lang",
  "article",
  "avg_monthly_views",
  "trend",
  "trend_pct_per_year",
  "yoy_growth_pct",
  "confidence",
  "flags",
];
const MINIMAL_FIELDS = [
  "lang",
  "avg_monthly_views",
  "trend",
  "trend_pct_per_year",
  "yoy_growth_pct",
  "confidence",
];

const pickFields = (results, fields) =>
  results.map((result) =>
    Object.fromEntries(fields.map((field) => [field, result[field]])),
  );

export const compactResults = (results) => {
  if (results.length <= MAX_FULL_RESULTS) {
    return results;
  }

  return pickFields(
    results,
    results.length > MAX_COMPACT_RESULTS ? MINIMAL_FIELDS : COMPACT_FIELDS,
  );
};
