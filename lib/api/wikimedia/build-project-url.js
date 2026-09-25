import {
  PAGEVIEWS_API_URL,
  PAGEVIEWS_ENDPOINT,
  PAGEVIEWS_ACCESS,
  PAGEVIEWS_AGENT,
} from "./constants/index.js";
import { formatDate, toProject } from "./utils/index.js";

export const buildProjectUrl = ({
  lang,
  granularity,
  start,
  end,
  access = PAGEVIEWS_ACCESS.ALL,
  agent = PAGEVIEWS_AGENT.USER,
}) => {
  const project = toProject(lang);
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return `${PAGEVIEWS_API_URL}/${PAGEVIEWS_ENDPOINT.AGGREGATE}/${project}/${access}/${agent}/${granularity}/${startDate}/${endDate}`;
};
