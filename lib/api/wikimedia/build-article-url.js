import {
  PAGEVIEWS_API_URL,
  PAGEVIEWS_ENDPOINT,
  PAGEVIEWS_ACCESS,
  PAGEVIEWS_AGENT,
} from "./constants/index.js";
import { encodeTitle, formatDate, toProject } from "./utils/index.js";

export const buildArticleUrl = ({
  lang,
  article,
  granularity,
  start,
  end,
  access = PAGEVIEWS_ACCESS.ALL,
  agent = PAGEVIEWS_AGENT.USER,
}) => {
  const project = toProject(lang);
  const title = encodeTitle(article);
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return `${PAGEVIEWS_API_URL}/${PAGEVIEWS_ENDPOINT.PER_ARTICLE}/${project}/${access}/${agent}/${title}/${granularity}/${startDate}/${endDate}`;
};
