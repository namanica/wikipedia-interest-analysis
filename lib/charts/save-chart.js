import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CHART_FILE } from "./constants/index.js";
import { buildChartSvg } from "./build-chart-svg.js";
import { svgToPng } from "./utils/index.js";

export const saveChart = async ({ dir, ...chart }) => {
  const svg = await buildChartSvg(chart);
  const png = await svgToPng(svg);
  const svgPath = join(dir, CHART_FILE.SVG);
  const pngPath = join(dir, CHART_FILE.PNG);

  await Promise.all([writeFile(svgPath, svg), writeFile(pngPath, png)]);

  return { svgPath, pngPath };
};
