import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const JSON_INDENT = 2;

export const writeJson = async (filePath, data) => {
  const content = JSON.stringify(data, null, JSON_INDENT);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${content}\n`);
};
