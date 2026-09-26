import { PAGEVIEWS_ACCESS, PAGEVIEWS_AGENT } from "#lib/api/wikimedia/index.js";

export const buildCacheKey = ({ lang, article }) =>
  JSON.stringify({
    lang,
    article,
    access: PAGEVIEWS_ACCESS.ALL,
    agent: PAGEVIEWS_AGENT.USER,
  });
