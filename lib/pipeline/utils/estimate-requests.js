import { PAGEVIEWS_GRANULARITY } from "#lib/api/wikimedia/index.js";
import { addTotalTargets } from "./add-total-targets.js";
import { buildTargets } from "./build-targets.js";
import { findMissingRequests } from "./find-missing-requests.js";
import { parseYears } from "./parse-years.js";
import { resolveFetchPeriod } from "./resolve-fetch-period.js";

export const estimateRequests = async ({
  articles,
  start,
  end,
  years,
  cache,
}) => {
  const targets = addTotalTargets(buildTargets({ articles }));
  const period = resolveFetchPeriod({
    start,
    end,
    years: parseYears(years),
    granularity: PAGEVIEWS_GRANULARITY.MONTHLY,
  });
  const requests = await findMissingRequests({ targets, period, cache });

  return requests.length;
};
