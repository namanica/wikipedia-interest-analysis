import { writeJson } from "#lib/utils/index.js";
import { FILE_HINT } from "./constants/index.js";
import {
  describeRun,
  loadRun,
  parseChartFormat,
  renderRunChart,
} from "./utils/index.js";

export const renderChart = async ({ run, out, format }) => {
  const chartFormat = parseChartFormat(format);
  const { runId, runDir, manifestPath, manifest } = await loadRun({ run, out });
  const chartFiles = await renderRunChart({
    manifest,
    runDir,
    format: chartFormat,
  });
  const [filePath] = Object.values(chartFiles);
  const { variant, shows } = describeRun(manifest);

  await writeJson(manifestPath, {
    ...manifest,
    files: { ...manifest.files, ...chartFiles },
  });

  return {
    summary: `Chart saved to ${filePath} (analysis: ${variant}).`,
    data: { run_id: runId, format: chartFormat, variant, shows },
    files: [filePath],
    hints: [FILE_HINT.CHART],
    networkRequests: 0,
  };
};
