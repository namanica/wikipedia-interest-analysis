import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { OUTPUT_DIR, runAnalysis } from "#lib/pipeline/index.js";
import { PROMISING_CRITERIA } from "#lib/analysis/index.js";

const USAGE = `Answer "is interest in <topic> growing in <languages>?" with one command:
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
  --min-monthly-views <n>    "promising" needs at least this, default: ${PROMISING_CRITERIA.MIN_MONTHLY_VIEWS}
  --min-growth <pct>         "promising" needs at least this growth, default: ${PROMISING_CRITERIA.MIN_GROWTH_PCT}
  --confirm                  allow a large number of requests (after asking the user)
  --out <dir>                where to save runs, default: ./${OUTPUT_DIR}
  -h, --help                 show this help
`;

const OPTIONS = {
  topic: { type: "string" },
  "query-lang": { type: "string" },
  qid: { type: "string" },
  langs: { type: "string" },
  years: { type: "string" },
  start: { type: "string" },
  end: { type: "string" },
  raw: { type: "boolean" },
  "keep-spikes": { type: "boolean" },
  "min-monthly-views": { type: "string" },
  "min-growth": { type: "string" },
  confirm: { type: "boolean" },
  out: { type: "string" },
};

const toNumber = (value) => (value === undefined ? undefined : Number(value));

runScript(async () => {
  const values = parseCli({ options: OPTIONS, usage: USAGE });
  const result = await runAnalysis({
    topic: values.topic,
    qid: values.qid,
    langs: values.langs,
    queryLang: values["query-lang"],
    years: values.years,
    start: values.start,
    end: values.end,
    raw: values.raw,
    keepSpikes: values["keep-spikes"],
    minMonthlyViews: toNumber(values["min-monthly-views"]),
    minGrowthPct: toNumber(values["min-growth"]),
    confirm: values.confirm,
    out: values.out,
  });

  printResult(result);
});
