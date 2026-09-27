import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CHART_FILE_NAME, CHART_FORMAT } from "./constants/index.js";
import { buildChartSvg } from "./build-chart-svg.js";
import { svgToPng } from "./utils/index.js";

export const saveChart = async ({
  dir,
  format = CHART_FORMAT.PNG,
  ...chart
}) => {
  const svg = await buildChartSvg(chart);
  const content = format === CHART_FORMAT.SVG ? svg : await svgToPng(svg);
  const filePath = join(dir, `${CHART_FILE_NAME}.${format}`);

  await writeFile(filePath, content);

  return filePath;
};
