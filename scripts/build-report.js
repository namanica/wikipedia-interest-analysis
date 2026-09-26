import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { OUTPUT_DIR, buildReport } from "#lib/pipeline/index.js";

const USAGE = `Build a one-page PDF report from a saved run of run-analysis.js, without new downloads.
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
  --out <dir>         folder with runs, default: ./${OUTPUT_DIR}
  -h, --help          show this help
`;

const OPTIONS = {
  run: { type: "string" },
  summary: { type: "string" },
  question: { type: "string" },
  next: { type: "string" },
  locale: { type: "string" },
  out: { type: "string" },
};

runScript(async () => {
  const values = parseCli({ options: OPTIONS, usage: USAGE });
  const result = await buildReport(values);

  printResult(result);
});
