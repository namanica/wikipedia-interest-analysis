import { fileURLToPath } from "node:url";

const toAssetPath = (name) =>
  fileURLToPath(new URL(`../../../assets/fonts/${name}`, import.meta.url));

export const FONT_FILES = {
  REGULAR: toAssetPath("NotoSans-Regular.ttf"),
  BOLD: toAssetPath("NotoSans-Bold.ttf"),
};
