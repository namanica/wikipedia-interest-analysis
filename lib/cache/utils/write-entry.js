import { rename, writeFile } from "node:fs/promises";

export const writeEntry = async (filePath, entry) => {
  const tempPath = `${filePath}.${process.pid}.tmp`;
  const content = JSON.stringify(entry);

  await writeFile(tempPath, content);
  await rename(tempPath, filePath);
};
