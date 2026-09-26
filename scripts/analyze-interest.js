import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { analyzeInterest } from "#lib/pipeline/index.js";

const USAGE = `Analyze interest in Wikipedia articles: trend, growth, spikes and how much to trust them.

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
`;

const OPTIONS = {
  article: { type: "string", multiple: true },
  years: { type: "string" },
  start: { type: "string" },
  end: { type: "string" },
  raw: { type: "boolean" },
  "keep-spikes": { type: "boolean" },
};

runScript(async () => {
  const values = parseCli({ options: OPTIONS, usage: USAGE });
  const result = await analyzeInterest({
    articles: values.article,
    years: values.years,
    start: values.start,
    end: values.end,
    raw: values.raw,
    keepSpikes: values["keep-spikes"],
  });

  printResult(result);
});
