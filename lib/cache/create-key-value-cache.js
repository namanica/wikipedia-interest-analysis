import { createEntryStore } from "./utils/index.js";

const DEFAULT_TTL_DAYS = 30;
const MS_PER_DAY = 86400000;

export const createKeyValueCache = ({
  dir,
  now = () => new Date(),
  ttlDays = DEFAULT_TTL_DAYS,
} = {}) => {
  const store = createEntryStore(dir);

  const isExpired = ({ storedAt }) =>
    Date.parse(storedAt) + ttlDays * MS_PER_DAY < now().getTime();

  return {
    get: async (key) => {
      const entry = await store.read(key);

      return entry && !isExpired(entry) ? entry.value : null;
    },
    set: async (key, value) => {
      const storedAt = now().toISOString();

      await store.write(key, { key, storedAt, value });
    },
  };
};
