import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { FONT_FAMILY, FONT_FILES } from "#lib/utils/index.js";
import { CHART_STYLE } from "../constants/index.js";

let wasmReady = null;

const loadResvg = async () => {
  const resvg = await import("@resvg/resvg-wasm");

  wasmReady ??= readFile(
    fileURLToPath(import.meta.resolve("@resvg/resvg-wasm/index_bg.wasm")),
  ).then((wasm) => resvg.initWasm(wasm));
  await wasmReady;

  return resvg;
};

export const svgToPng = async (svg) => {
  const { Resvg } = await loadResvg();
  const fontBuffers = await Promise.all(
    Object.values(FONT_FILES).map((file) => readFile(file)),
  );
  const renderer = new Resvg(svg, {
    font: { fontBuffers, defaultFontFamily: FONT_FAMILY },
    fitTo: { mode: "width", value: CHART_STYLE.PNG_WIDTH },
    background: CHART_STYLE.BACKGROUND,
  });

  return renderer.render().asPng();
};
