import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { fetchPageviews } from "#lib/pipeline/index.js";
import { CACHE_DIR_ENV } from "#lib/cache/index.js";

const USAGE = `Fetch Wikipedia pageviews for articles or whole language editions.

Usage:
  node scripts/fetch-pageviews.js --article "uk:Астрономія" [--total uk] [options]

Options:
  --article <lang>:<title>   article to fetch, repeatable
  --total <lang>             pageviews of the whole language edition, repeatable
  --years <n>                period length in years, default: 3
  --start <YYYY-MM-DD>       first day, instead of --years
  --end <YYYY-MM-DD>         last day, default: yesterday (UTC)
  --granularity <value>      daily (default) or monthly; monthly also returns the values
  -h, --help                 show this help

Environment:
  ${CACHE_DIR_ENV}   cache directory, default: the OS user cache folder
`;

const OPTIONS = {
  article: { type: "string", multiple: true },
  total: { type: "string", multiple: true },
  years: { type: "string" },
  start: { type: "string" },
  end: { type: "string" },
  granularity: { type: "string" },
};

runScript(async () => {
  const { article, total, years, start, end, granularity } = parseCli({
    options: OPTIONS,
    usage: USAGE,
  });
  const result = await fetchPageviews({
    articles: article,
    totals: total,
    years,
    start,
    end,
    granularity,
  });

  printResult(result);
});
