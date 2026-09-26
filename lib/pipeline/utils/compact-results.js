const MAX_FULL_RESULTS = 3;
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

export const compactResults = (results) =>
  results.length > MAX_FULL_RESULTS
    ? results.map((result) =>
        Object.fromEntries(
          COMPACT_FIELDS.map((field) => [field, result[field]]),
        ),
      )
    : results;
