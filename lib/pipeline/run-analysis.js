import { rankResults } from "#lib/analysis/index.js";
import { createSeriesCache } from "#lib/cache/index.js";
import { SkillError } from "#lib/utils/index.js";
import { analyzeInterest } from "./analyze-interest.js";
import { resolveTopic } from "./resolve-topic.js";
import {
  compactResults,
  compactTopic,
  estimateRequests,
  saveRun,
  toArticleArgs,
} from "./utils/index.js";

const MAX_REQUESTS_WITHOUT_CONFIRM = 20;

export const runAnalysis = async ({
  topic,
  qid,
  langs,
  queryLang,
  start,
  end,
  years,
  raw = false,
  keepSpikes = false,
  minMonthlyViews,
  minGrowthPct,
  confirm = false,
  chart = false,
  out,
  seriesCache = createSeriesCache(),
  topicCache,
  fetch,
  now = new Date(),
}) => {
  const resolved = await resolveTopic({
    query: topic,
    qid,
    langs,
    queryLang,
    cache: topicCache,
    fetch,
  });
  const topicData = compactTopic(resolved.data);
  const articles = toArticleArgs(resolved.data.topic);

  if (!articles.length) {
    throw new SkillError({
      message: `No Wikipedia articles about "${resolved.data.topic.label}" in: ${langs}.`,
      hint: "Try other language codes, a broader topic, or another --qid from resolve-topic.js alternatives.",
    });
  }

  const period = { start, end, years };
  const estimated = await estimateRequests({
    articles,
    ...period,
    cache: seriesCache,
  });

  if (estimated > MAX_REQUESTS_WITHOUT_CONFIRM && !confirm) {
    return {
      summary: `This run needs about ${estimated} Wikimedia requests (limit without confirmation: ${MAX_REQUESTS_WITHOUT_CONFIRM}). Nothing was downloaded.`,
      data: { ...topicData, estimated_requests: estimated },
      hints: [
        "Ask the user whether to continue with this many languages, then rerun the same command with --confirm.",
      ],
      networkRequests: resolved.networkRequests,
    };
  }

  const analysis = await analyzeInterest({
    articles,
    ...period,
    raw,
    keepSpikes,
    cache: seriesCache,
    fetch,
  });
  const { results } = analysis.data;
  const ranking =
    results.length > 1
      ? rankResults(results, { minMonthlyViews, minGrowthPct })
      : null;
  const params = { topic, qid, langs, queryLang, ...period, raw, keepSpikes };
  const data = { ...topicData, ...analysis.data, ranking };
  const run = await saveRun({
    out,
    now,
    chart,
    manifest: { params, ...data, chart_data: analysis.charts },
  });

  return {
    summary: `Topic ${topicData.topic.qid} "${topicData.topic.label}". ${analysis.summary}`,
    data: { run_id: run.runId, ...data, results: compactResults(results) },
    files: [run.manifestPath, ...Object.values(run.files)],
    hints: [
      ...resolved.hints.filter((hint) => !hint.startsWith("Next:")),
      ...analysis.hints,
      ...(compactResults(results) === results
        ? []
        : [`Full metrics per language are in ${run.manifestPath}.`]),
    ],
    networkRequests: resolved.networkRequests + analysis.networkRequests,
  };
};
