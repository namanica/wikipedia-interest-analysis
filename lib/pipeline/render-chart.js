import { writeJson } from "#lib/utils/index.js";
import { loadRun, renderRunChart } from "./utils/index.js";

export const renderChart = async ({ run, out }) => {
  const { runId, runDir, manifestPath, manifest } = await loadRun({ run, out });
  const chartFiles = await renderRunChart({ manifest, runDir });
  const files = { ...manifest.files, ...chartFiles };

  await writeJson(manifestPath, { ...manifest, files });

  return {
    summary: `Chart for run ${runId} saved.`,
    data: { run_id: runId },
    files: [chartFiles.chart_png],
    hints: ["Attach or show the PNG to the user; the SVG is for documents."],
    networkRequests: 0,
  };
};
