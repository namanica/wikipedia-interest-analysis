import { join, resolve } from "node:path";
import { writeJson } from "#lib/utils/index.js";
import { MANIFEST_FILE, OUTPUT_DIR } from "../constants/index.js";
import { buildRunId } from "./build-run-id.js";

export const saveRun = async ({ out = OUTPUT_DIR, now, manifest }) => {
  const runId = buildRunId({ label: manifest.topic.label, now });
  const runDir = resolve(out, runId);
  const manifestPath = join(runDir, MANIFEST_FILE);

  await writeJson(manifestPath, {
    run_id: runId,
    created_at: now.toISOString(),
    ...manifest,
  });

  return { runId, runDir, manifestPath };
};
