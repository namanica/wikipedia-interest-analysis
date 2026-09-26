import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after } from "node:test";

export const createTempDir = async () => {
  const dir = await mkdtemp(join(tmpdir(), "wia-test-"));

  after(() => rm(dir, { recursive: true, force: true }));

  return dir;
};
