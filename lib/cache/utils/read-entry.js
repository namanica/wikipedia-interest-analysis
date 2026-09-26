import { readFile } from "node:fs/promises";

export const readEntry = async (filePath, key) => {
  try {
    const content = await readFile(filePath, "utf8");
    const entry = JSON.parse(content);

    return entry.key === key ? entry : null;
  } catch {
    return null;
  }
};
