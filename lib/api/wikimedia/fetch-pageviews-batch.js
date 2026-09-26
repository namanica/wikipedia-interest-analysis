import { fetchArticlePageviews } from "./fetch-article-pageviews.js";
import { fetchProjectPageviews } from "./fetch-project-pageviews.js";
import { mapWithConcurrency } from "./utils/index.js";

const MAX_CONCURRENCY = 3;

export const fetchPageviewsBatch = ({ requests, ...options }) =>
  mapWithConcurrency(requests, MAX_CONCURRENCY, (request) =>
    request.article
      ? fetchArticlePageviews({ ...options, ...request })
      : fetchProjectPageviews({ ...options, ...request }),
  );
