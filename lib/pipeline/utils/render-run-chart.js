import { saveChart } from "#lib/charts/index.js";
import { buildChartTitles } from "./build-chart-titles.js";

export const renderRunChart = async ({ manifest, runDir }) => {
  const titles = buildChartTitles({ manifest });
  const { svgPath, pngPath } = await saveChart({
    dir: runDir,
    series: manifest.chart_data,
    raw: manifest.params.raw,
    ...titles,
  });

  return { chart_png: pngPath, chart_svg: svgPath };
};
