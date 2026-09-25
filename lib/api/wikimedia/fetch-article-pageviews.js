import { buildArticleUrl } from "./build-article-url.js";
import { requestJson } from "./request-json.js";
import { toSeries } from "./to-series.js";

export const fetchArticlePageviews = async ({
  lang,
  article,
  granularity,
  start,
  end,
  counter,
  fetch,
}) => {
  const url = buildArticleUrl({ lang, article, granularity, start, end });
  const response = await requestJson({ url, counter, fetch });

  return toSeries({ items: response?.items, lang, article, granularity });
};
