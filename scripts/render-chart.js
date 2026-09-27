import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { OUTPUT_DIR, renderChart } from "#lib/pipeline/index.js";

const USAGE = `Render a chart (PNG by default, or SVG) for a saved run of run-analysis.js, without new downloads.
One language: monthly values with the trend line and spike days.
Several languages: index lines (first 12 months = 100).

Usage:
  node scripts/render-chart.js --run <run_id|latest> [--format png|svg] [--out <dir>]

Options:
  --run <id>       run_id from run-analysis.js output, or "latest" (default)
  --format <fmt>   png (default) or svg, only if the user asks for SVG
  --out <dir>      folder with runs, default: ./${OUTPUT_DIR}
  -h, --help       show this help
`;

const OPTIONS = {
  run: { type: "string" },
  format: { type: "string" },
  out: { type: "string" },
};

runScript(async () => {
  const { run, format, out } = parseCli({ options: OPTIONS, usage: USAGE });
  const result = await renderChart({ run, format, out });

  printResult(result);
});
