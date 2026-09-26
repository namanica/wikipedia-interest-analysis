import { createHash } from "node:crypto";

export const toFileName = (key) => {
  const hash = createHash("sha256").update(key).digest("hex");

  return `${hash}.json`;
};
