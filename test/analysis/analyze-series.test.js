import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeSeries } from "#lib/analysis/index.js";
import {
  buildDailyPoints,
  monthIndexOf,
  noise,
  seasonal,
} from "#test/fixtures/synthetic-series.js";

const PERIOD = { start: "2023-01-01", end: "2025-12-31" };
const START_YEAR = 2023;

const monthOf = (date) => Number(date.slice(5, 7));

const run = ({
  article,
  total = () => 10_000_000,
  period = PERIOD,
  ...options
}) =>
  analyzeSeries({
    lang: "xx",
    article: "Test",
    articlePoints: buildDailyPoints({ ...period, value: article }),
    totalPoints: buildDailyPoints({ ...period, value: total }),
    period,
    ...options,
  });

test("steady seasonal growth: growing, high confidence, no flags", () => {
  const { result, chart } = run({
    article: (date, index) =>
      Math.round(
        300 *
          seasonal(monthOf(date)) *
          (1 + 0.02 * monthIndexOf(date, START_YEAR)) +
          noise(index) * 5,
      ),
  });

  assert.equal(result.trend, "growing");
  assert.equal(result.confidence, "high");
  assert.deepEqual(result.flags, []);
  assert.equal(result.months, 36);
  assert.ok(result.yoy_growth_pct > 15 && result.yoy_growth_pct < 20);
  assert.ok(result.trend_pct_per_year > 15);
  assert.equal(chart.points.length, 36);
  assert.equal(chart.trend.length, 2);
});

test("flat seasonal interest: no clear trend, medium confidence", () => {
  const { result } = run({
    article: (date, index) =>
      Math.round(300 * seasonal(monthOf(date)) + noise(index) * 20),
  });

  assert.equal(result.trend, "no_clear_trend");
  assert.equal(result.confidence, "medium");
  assert.ok(result.flags.includes("not_significant"));
  assert.ok(Math.abs(result.yoy_growth_pct) < 5);
});

test("a steady decline is found", () => {
  const { result } = run({
    article: (date) => Math.round(2000 - 40 * monthIndexOf(date, START_YEAR)),
  });

  assert.equal(result.trend, "declining");
  assert.ok(result.yoy_growth_pct < -20);
});

test("very few views: low confidence", () => {
  const { result } = run({
    article: (date, index) => (index % 2 === 0 ? 1 : 0),
  });

  assert.equal(result.confidence, "low");
  assert.ok(result.flags.includes("very_low_volume"));
});

test("growth made only of spike days: spike_driven, low confidence", () => {
  const { result } = run({
    article: (date, index) => {
      const isLastYear = date >= "2025-01-01";
      const isSpikeDay = date.endsWith("-15");

      return isLastYear && isSpikeDay ? 15_000 : 200 + Math.round(noise(index));
    },
  });

  assert.ok(result.flags.includes("spike_driven"));
  assert.ok(result.flags.includes("spike_heavy"));
  assert.equal(result.confidence, "low");
  assert.equal(result.trend, "no_clear_trend");
  assert.ok(result.top_spikes.every((date) => date.endsWith("-15")));
});

test("keeping spikes (--keep-spikes) makes the same series look like growth", () => {
  const { result } = run({
    keepSpikes: true,
    article: (date, index) =>
      date >= "2025-01-01" && date.endsWith("-15")
        ? 15_000
        : 200 + Math.round(noise(index)),
  });

  assert.equal(result.trend, "growing");
});

test("an article that appears mid-period: late_start and a shorter series", () => {
  const { result } = run({
    article: (date) => (date < "2024-01-01" ? 0 : 500),
  });

  assert.ok(result.flags.includes("late_start"));
  assert.ok(!result.flags.includes("short_history"));
  assert.equal(result.first_month, "2024-01-01");
  assert.equal(result.months, 24);
});

test("normalization removes growth of the whole edition", () => {
  const edition = (date) =>
    Math.round(10_000_000 * 1.03 ** monthIndexOf(date, START_YEAR));
  const flatArticle = (date, index) => 500 + Math.round(noise(index));
  const normalized = run({ article: flatArticle, total: edition }).result;
  const raw = run({ article: flatArticle, total: edition, raw: true }).result;

  assert.equal(normalized.trend, "declining");
  assert.ok(normalized.flags.includes("raw_normalized_disagree"));
  assert.equal(raw.trend, "no_clear_trend");
  assert.ok(Math.abs(raw.yoy_views_growth_pct) < 2);
});

test("less than two years: no YoY, short_history", () => {
  const { result } = run({
    period: { start: "2024-07-01", end: "2025-12-31" },
    article: (date) => 500 + monthIndexOf(date, START_YEAR),
  });

  assert.equal(result.months, 18);
  assert.equal(result.yoy_growth_pct, null);
  assert.equal(result.index_last_12m, null);
  assert.ok(result.flags.includes("short_history"));
});

test("output values are rounded and ready to show", () => {
  const { result } = run({ article: (date, index) => 1000 + index });

  for (const key of [
    "trend_pct_per_year",
    "yoy_growth_pct",
    "spike_share_pct",
  ]) {
    assert.equal(result[key], Math.round(result[key] * 10) / 10, key);
  }

  assert.ok(Number.isInteger(result.avg_monthly_views));
});
