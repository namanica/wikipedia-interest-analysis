import { buildProjectUrl } from "./build-project-url.js";
import { requestJson } from "./request-json.js";
import { toSeries } from "./to-series.js";

export const fetchProjectPageviews = async ({
  lang,
  granularity,
  start,
  end,
  counter,
  fetch,
}) => {
  const url = buildProjectUrl({ lang, granularity, start, end });
  const response = await requestJson({ url, counter, fetch });

  return toSeries({ items: response?.items, lang, granularity });
};
