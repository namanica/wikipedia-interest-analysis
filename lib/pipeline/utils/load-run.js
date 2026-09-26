import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { SkillError } from "#lib/utils/index.js";
import { MANIFEST_FILE, OUTPUT_DIR } from "../constants/index.js";

const LATEST_RUN = "latest";

const findLatestRun = async (outDir) => {
  const entries = await readdir(outDir, { withFileTypes: true }).catch(
    () => [],
  );
  const runIds = entries
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => name)
    .sort();

  return runIds.at(-1);
};

export const loadRun = async ({ run = LATEST_RUN, out = OUTPUT_DIR }) => {
  const outDir = resolve(out);
  const runId = run === LATEST_RUN ? await findLatestRun(outDir) : run;
  const runDir = join(outDir, runId ?? "");
  const manifestPath = join(runDir, MANIFEST_FILE);
  const content = await readFile(manifestPath, "utf8").catch(() => null);

  if (!runId || !content) {
    throw new SkillError({
      message: `Run not found: ${run} (in ${outDir}).`,
      hint: "Use the run_id printed by run-analysis.js, or run run-analysis.js first. Pass --out if runs were saved elsewhere.",
    });
  }

  return { runId, runDir, manifestPath, manifest: JSON.parse(content) };
};
