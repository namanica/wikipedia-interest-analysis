import { fetchArticlePageviews } from "./fetch-article-pageviews.js";
import { fetchProjectPageviews } from "./fetch-project-pageviews.js";
import { mapWithConcurrency } from "./utils/index.js";

const MAX_CONCURRENCY = 3;

export const fetchPageviewsBatch = ({ targets, ...options }) =>
  mapWithConcurrency(targets, MAX_CONCURRENCY, ({ lang, article }) =>
    article
      ? fetchArticlePageviews({ lang, article, ...options })
      : fetchProjectPageviews({ lang, ...options }),
  );
