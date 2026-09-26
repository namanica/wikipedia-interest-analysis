import { join } from "node:path";
import { readEntry } from "./read-entry.js";
import { resolveCacheDir } from "./resolve-cache-dir.js";
import { toFileName } from "./to-file-name.js";
import { writeEntry } from "./write-entry.js";

export const createEntryStore = (dir) => {
  const dirReady = dir ? Promise.resolve(dir) : resolveCacheDir();

  const getFilePath = async (key) => {
    const cacheDir = await dirReady;
    const fileName = toFileName(key);

    return join(cacheDir, fileName);
  };

  return {
    read: async (key) => {
      const filePath = await getFilePath(key);

      return readEntry(filePath, key);
    },
    write: async (key, entry) => {
      const filePath = await getFilePath(key);

      await writeEntry(filePath, entry);
    },
  };
};
