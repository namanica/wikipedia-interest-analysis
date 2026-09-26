import { join, resolve } from "node:path";
import { writeJson } from "#lib/utils/index.js";
import { MANIFEST_FILE, OUTPUT_DIR } from "../constants/index.js";
import { buildRunId } from "./build-run-id.js";
import { renderRunChart } from "./render-run-chart.js";

export const saveRun = async ({
  out = OUTPUT_DIR,
  now,
  manifest,
  chart = false,
}) => {
  const runId = buildRunId({ label: manifest.topic.label, now });
  const runDir = resolve(out, runId);
  const manifestPath = join(runDir, MANIFEST_FILE);
  const fullManifest = {
    run_id: runId,
    created_at: now.toISOString(),
    ...manifest,
  };

  await writeJson(manifestPath, fullManifest);

  const files = chart
    ? await renderRunChart({ manifest: fullManifest, runDir })
    : {};

  await writeJson(manifestPath, { ...fullManifest, files });

  return { runId, runDir, manifestPath, files };
};
