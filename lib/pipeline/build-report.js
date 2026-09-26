import { join } from "node:path";
import { CHART_LABELS, buildChartSvg } from "#lib/charts/index.js";
import { REPORT_FILE, REPORT_TEXT, buildReportPdf } from "#lib/report/index.js";
import { writeJson } from "#lib/utils/index.js";
import {
  assertReportText,
  buildChartTitles,
  loadRun,
  orderByRanking,
  resolveLocale,
} from "./utils/index.js";

export const buildReport = async ({
  run,
  out,
  summary,
  question,
  next,
  locale,
}) => {
  assertReportText({ summary, question, next });

  const resolved = resolveLocale(locale);
  const text = REPORT_TEXT[resolved.key];
  const labels = CHART_LABELS[resolved.key];
  const { runId, runDir, manifestPath, manifest } = await loadRun({ run, out });
  const titles = buildChartTitles({ manifest, labels });
  const chartSvg = await buildChartSvg({
    series: manifest.chart_data,
    raw: manifest.params.raw,
    labels,
    ...titles,
  });
  const filePath = join(
    runDir,
    `${REPORT_FILE.PREFIX}-${resolved.locale}${REPORT_FILE.EXTENSION}`,
  );

  await buildReportPdf({
    filePath,
    text,
    question: question?.trim() || text.DEFAULT_QUESTION(manifest.topic.label),
    summary: summary.trim(),
    next: next?.trim() || text.DEFAULT_NEXT,
    rows: orderByRanking(manifest),
    period: manifest.assumptions.period,
    raw: manifest.params.raw,
    keepSpikes: manifest.params.keepSpikes,
    limitations: manifest.limitations,
    chartSvg,
  });
  await writeJson(manifestPath, {
    ...manifest,
    files: { ...manifest.files, report_pdf: filePath },
  });

  return {
    summary: `One-page PDF report for run ${runId} saved (${resolved.locale}).`,
    data: { run_id: runId, locale: resolved.locale, pages: 1 },
    files: [filePath],
    hints: resolved.isSupported
      ? []
      : [
          `Locale "${locale}" is not available (only: ${Object.keys(REPORT_TEXT).join(", ").toLowerCase()}); labels are in English, the summary stays as written.`,
        ],
    networkRequests: 0,
  };
};
