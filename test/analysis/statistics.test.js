import { test } from "node:test";
import assert from "node:assert/strict";
import { median } from "#lib/analysis/utils/median.js";
import { mean } from "#lib/analysis/utils/mean.js";
import { roundTo } from "#lib/analysis/utils/round-to.js";
import { seasonalMannKendall } from "#lib/analysis/utils/seasonal-mann-kendall.js";
import { seasonalSensSlope } from "#lib/analysis/utils/seasonal-sens-slope.js";
import { assessTrend } from "#lib/analysis/utils/assess-trend.js";
import { buildTrendLine } from "#lib/analysis/utils/build-trend-line.js";
import {
  buildMonthlyPoints,
  seasonal,
  noise,
} from "#test/fixtures/synthetic-series.js";

test("median and mean", () => {
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(mean([1, 2, 3, 6]), 3);
  assert.equal(mean([]), 0);
});

test("roundTo keeps null and rounds to digits", () => {
  assert.equal(roundTo(1.2349, 2), 1.23);
  assert.equal(roundTo(-45.849, 1), -45.8);
  assert.equal(roundTo(null, 1), null);
  assert.equal(roundTo(Number.NaN, 1), null);
});

test("Sen's slope recovers a linear trend through strong seasonality", () => {
  const points = buildMonthlyPoints({
    startYear: 2021,
    months: 36,
    value: (index, month) => 100 * seasonal(month) + index,
  });

  assert.ok(Math.abs(seasonalSensSlope(points) - 12) < 1e-9);
});

test("seasonal Mann-Kendall finds a significant rise and fall", () => {
  const rising = buildMonthlyPoints({
    startYear: 2021,
    months: 36,
    value: (index, month) => 1000 * seasonal(month) + 10 * index + noise(index),
  });
  const falling = rising.map(({ date, value }) => ({
    date,
    value: 2000 - value,
  }));

  const up = seasonalMannKendall(rising);
  const down = seasonalMannKendall(falling);

  assert.ok(up.s > 0 && up.pValue < 0.001);
  assert.ok(down.s < 0 && down.pValue < 0.001);
});

test("seasonal Mann-Kendall does not treat pure seasonality as a trend", () => {
  const points = buildMonthlyPoints({
    startYear: 2021,
    months: 36,
    value: (index, month) => 1000 * seasonal(month) + noise(index),
  });
  const trend = assessTrend(points);

  assert.ok(seasonalMannKendall(points).pValue > 0.05);
  assert.equal(trend.direction, "no_clear_trend");
});

test("a constant series has no trend and p = 1", () => {
  const points = buildMonthlyPoints({
    startYear: 2021,
    months: 36,
    value: () => 50,
  });

  assert.deepEqual(seasonalMannKendall(points), { s: 0, pValue: 1 });
  assert.equal(seasonalSensSlope(points), 0);
});

test("assessTrend reports direction and % per year relative to the average", () => {
  const points = buildMonthlyPoints({
    startYear: 2021,
    months: 36,
    value: (index) => 100 + index,
  });
  const trend = assessTrend(points);

  assert.equal(trend.direction, "growing");
  assert.equal(trend.slopePerYear, 12);
  assert.ok(Math.abs(trend.pctPerYear - (12 / 117.5) * 100) < 1e-9);
});

test("the trend line follows the Sen's slope", () => {
  const points = buildMonthlyPoints({
    startYear: 2021,
    months: 24,
    value: (index) => 10 + index,
  });
  const [first, last] = buildTrendLine(points, 12);

  assert.deepEqual(first, { date: "2021-01-01", value: 10 });
  assert.deepEqual(last, { date: "2022-12-01", value: 33 });
});
