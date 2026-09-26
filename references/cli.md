# CLI reference

All scripts print one JSON object to stdout: `{ok, summary, data, files, hints, network_requests}`.
Errors go to stderr as `{ok: false, error, hint}` with exit code 1 (input) or 2 (network/API).
Run them from the user's working folder as `node <skill>/scripts/<name>.js`.

Environment: `WIKIPEDIA_INTEREST_CACHE_DIR` overrides the cache folder (default: the OS user cache folder, falls back to the system temp folder).

## run-analysis.js

```text
Answer "is interest in <topic> growing in <languages>?" with one command:
finds the articles, downloads pageviews (cached), analyzes them and saves the run.

Usage:
  node scripts/run-analysis.js --topic "intermittent fasting" --langs pl,cs [options]

Options:
  --topic <text>             topic name; English works best
  --query-lang <code>        language of --topic, default: en (e.g. uk for "астрономія")
  --qid <Q…>                 exact Wikidata item instead of --topic (from alternatives)
  --langs <a,b,…>            Wikipedia language codes to compare, comma-separated
  --years <n>                period length in years, default: 3
  --start <YYYY-MM-DD>       first day instead of --years
  --end <YYYY-MM-DD>         last day, default: yesterday (UTC); aligned to full months
  --raw                      do not normalize by the language edition's total views
  --keep-spikes              do not remove one-day spikes before measuring the trend
  --min-monthly-views <n>    "promising" needs at least this, default: 300
  --min-growth <pct>         "promising" needs at least this growth, default: 0
  --chart                    also save a PNG/SVG chart into the run folder
  --confirm                  allow a large number of requests (after asking the user)
  --out <dir>                where to save runs, default: ./wikipedia-interest-analysis-output
  -h, --help                 show this help
```

## resolve-topic.js

```text
Find the Wikipedia articles about a topic in the given language editions (via Wikidata).

Usage:
  node scripts/resolve-topic.js --query "intermittent fasting" --langs pl,cs [options]

Options:
  --query <text>         topic name; English works best
  --query-lang <code>    language of --query, default: en (e.g. uk for "астрономія")
  --qid <Q…>             use this Wikidata item instead of searching (from alternatives)
  --langs <a,b,…>        Wikipedia language codes to look up, comma-separated
  -h, --help             show this help
```

## analyze-interest.js

```text
Analyze interest in Wikipedia articles: trend, growth, spikes and how much to trust them.

Usage:
  node scripts/analyze-interest.js --article "uk:Астрономія" [--article "pl:Astronomia"] [options]

Options:
  --article <lang>:<title>   article to analyze, repeatable (titles come from resolve-topic.js)
  --years <n>                period length in years, default: 3
  --start <YYYY-MM-DD>       first day, instead of --years (aligned to full months)
  --end <YYYY-MM-DD>         last day, default: yesterday (UTC, aligned to full months)
  --raw                      do not normalize by the language edition's total views
  --keep-spikes              do not remove one-day spikes before measuring the trend
  -h, --help                 show this help
```

## fetch-pageviews.js

```text
Fetch Wikipedia pageviews for articles or whole language editions.

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
  WIKIPEDIA_INTEREST_CACHE_DIR   cache directory, default: the OS user cache folder
```

## render-chart.js

```text
Render a chart (PNG + SVG) for a saved run of run-analysis.js, without new downloads.
One language: monthly values with the trend line and spike days.
Several languages: index lines (first 12 months = 100).

Usage:
  node scripts/render-chart.js --run <run_id|latest> [--out <dir>]

Options:
  --run <id>       run_id from run-analysis.js output, or "latest" (default)
  --out <dir>      folder with runs, default: ./wikipedia-interest-analysis-output
  -h, --help       show this help
```

## build-report.js

```text
Build a one-page PDF report from a saved run of run-analysis.js, without new downloads.
The table, chart, confidence, assumptions and limitations come from the run;
only the conclusion (--summary) and optional texts come from you.

Usage:
  node scripts/build-report.js --run <run_id|latest> --summary "<2-3 sentences>" [options]

Options:
  --run <id>          run_id from run-analysis.js output, or "latest" (default)
  --summary <text>    conclusion in the user's language, max 700 characters (required)
  --question <text>   report title, default: "How is interest in <topic> changing?"
  --next <text>       what to check next, max 400 characters
  --locale <code>     language of labels: en (default) or uk
  --out <dir>         folder with runs, default: ./wikipedia-interest-analysis-output
  -h, --help          show this help
```
