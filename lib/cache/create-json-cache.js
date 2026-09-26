import { join } from "node:path";
import { toIsoDate } from "#lib/utils/index.js";
import {
  addToEntry,
  getCoveredRanges,
  readEntry,
  resolveCacheDir,
  subtractRanges,
  toFileName,
  writeEntry,
} from "./utils/index.js";

export const createJsonCache = ({ dir, now = () => new Date() } = {}) => {
  const dirReady = dir ? Promise.resolve(dir) : resolveCacheDir();
  const entries = new Map();

  const getFilePath = async (key) => {
    const cacheDir = await dirReady;
    const fileName = toFileName(key);

    return join(cacheDir, fileName);
  };

  const loadEntry = async (key) => {
    if (!entries.has(key)) {
      const filePath = await getFilePath(key);
      const entry = await readEntry(filePath, key);

      entries.set(key, entry);
    }

    return entries.get(key);
  };

  const getToday = () => toIsoDate(now());

  return {
    get: async (key, { start, end }) => {
      const { points } = await loadEntry(key);

      return points.filter(({ date }) => date >= start && date <= end);
    },
    missingRanges: async (key, range) => {
      const entry = await loadEntry(key);
      const today = getToday();
      const covered = getCoveredRanges(entry, today);

      return subtractRanges(range, covered);
    },
    set: async (key, update) => {
      const entry = await loadEntry(key);
      const today = getToday();
      const nextEntry = addToEntry(entry, update, today);
      const filePath = await getFilePath(key);

      entries.set(key, nextEntry);
      await writeEntry(filePath, nextEntry);
    },
  };
};
