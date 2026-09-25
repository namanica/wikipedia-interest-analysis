import { parseTimestamp } from "./utils/index.js";

export const toSeries = ({
  items = [],
  lang,
  article = null,
  granularity,
}) => ({
  lang,
  article,
  granularity,
  points: items.map(({ timestamp, views }) => ({
    date: parseTimestamp(timestamp),
    value: views,
  })),
});
