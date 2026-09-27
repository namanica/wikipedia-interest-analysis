import { CHART_FORMAT, saveChart } from "#lib/charts/index.js";
import { buildChartTitles } from "./build-chart-titles.js";

export const renderRunChart = async ({
  manifest,
  runDir,
  format = CHART_FORMAT.PNG,
}) => {
  const titles = buildChartTitles({ manifest });
  const filePath = await saveChart({
    dir: runDir,
    format,
    series: manifest.chart_data,
    raw: manifest.params.raw,
    ...titles,
  });

  return { [`chart_${format}`]: filePath };
};
