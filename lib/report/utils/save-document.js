import { createWriteStream } from "node:fs";
import { finished } from "node:stream/promises";

export const saveDocument = async (doc, filePath) => {
  const stream = createWriteStream(filePath);

  doc.pipe(stream);
  doc.end();
  await finished(stream);
};
