import { toIsoDate } from "#lib/utils/index.js";
import {
  addToEntry,
  createEmptyEntry,
  createEntryStore,
  getCoveredRanges,
  subtractRanges,
} from "./utils/index.js";

export const createSeriesCache = ({ dir, now = () => new Date() } = {}) => {
  const store = createEntryStore(dir);
  const entries = new Map();

  const loadEntry = async (key) => {
    if (!entries.has(key)) {
      const entry = await store.read(key);

      entries.set(key, entry ?? createEmptyEntry(key));
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

      entries.set(key, nextEntry);
      await store.write(key, nextEntry);
    },
  };
};
