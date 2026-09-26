import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { fetchPageviews } from "#lib/pipeline/index.js";
import { CACHE_DIR_ENV } from "#lib/cache/index.js";

const USAGE = `Fetch Wikipedia pageviews for articles or whole language editions.

Usage:
  node scripts/fetch-pageviews.js --article "uk:Астрономія" [--total uk] [options]

Options:
  --article <lang>:<title>   article to fetch, repeatable
  --total <lang>             pageviews of the whole language edition, repeatable
  --start <YYYY-MM-DD>       first day, default: 3 years before --end
  --end <YYYY-MM-DD>         last day, default: yesterday (UTC)
  --granularity <value>      daily (default) or monthly; monthly also returns the values
  -h, --help                 show this help

Environment:
  ${CACHE_DIR_ENV}   cache directory, default: the OS user cache folder
`;

const OPTIONS = {
  article: { type: "string", multiple: true },
  total: { type: "string", multiple: true },
  start: { type: "string" },
  end: { type: "string" },
  granularity: { type: "string" },
};

runScript(async () => {
  const { article, total, start, end, granularity } = parseCli({
    options: OPTIONS,
    usage: USAGE,
  });
  const result = await fetchPageviews({
    articles: article,
    totals: total,
    start,
    end,
    granularity,
  });

  printResult(result);
});
