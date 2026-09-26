import { readFile } from "node:fs/promises";

const createEmptyEntry = (key) => ({
  key,
  ranges: [],
  recent: { fetchedOn: null, ranges: [] },
  points: [],
});

export const readEntry = async (filePath, key) => {
  try {
    const content = await readFile(filePath, "utf8");
    const entry = JSON.parse(content);

    return entry.key === key ? entry : createEmptyEntry(key);
  } catch {
    return createEmptyEntry(key);
  }
};
