import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";

export const summarizeSeries = ({ lang, article, granularity, points }) => ({
  lang,
  article,
  points: points.length,
  total_views: points.reduce((sum, { value }) => sum + value, 0),
  first_date: points.at(0)?.date ?? null,
  last_date: points.at(-1)?.date ?? null,
  ...(granularity === PAGEVIEWS_GRANULARITY.MONTHLY && { values: points }),
});
