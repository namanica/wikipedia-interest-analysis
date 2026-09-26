import { test } from "node:test";
import assert from "node:assert/strict";
import { toMonthlyPoints } from "#lib/models/index.js";
import { normalizePoints } from "#lib/analysis/utils/normalize-points.js";
import { computeYoy } from "#lib/analysis/utils/compute-yoy.js";
import { computeIndex } from "#lib/analysis/utils/compute-index.js";
import { toIndexPoints } from "#lib/analysis/utils/to-index-points.js";
import { fillDailyGaps } from "#lib/analysis/utils/fill-daily-gaps.js";
import { trimLeadingZeros } from "#lib/analysis/utils/trim-leading-zeros.js";
import {
  buildDailyPoints,
  buildMonthlyPoints,
} from "#test/fixtures/synthetic-series.js";

test("daily points are summed into calendar months", () => {
  const daily = buildDailyPoints({
    start: "2024-01-30",
    end: "2024-03-01",
    value: () => 2,
  });

  assert.deepEqual(toMonthlyPoints(daily), [
    { date: "2024-01-01", value: 4 },
    { date: "2024-02-01", value: 58 },
    { date: "2024-03-01", value: 2 },
  ]);
});

test("missing days are filled with zeros", () => {
  const filled = fillDailyGaps([{ date: "2024-01-02", value: 5 }], {
    start: "2024-01-01",
    end: "2024-01-03",
  });

  assert.deepEqual(
    filled.map(({ value }) => value),
    [0, 5, 0],
  );
});

test("leading zero months are dropped, inner zeros are kept", () => {
  const points = [0, 0, 3, 0, 4].map((value, index) => ({
    date: `m${index}`,
    value,
  }));

  assert.deepEqual(
    trimLeadingZeros(points).map(({ value }) => value),
    [3, 0, 4],
  );
  assert.deepEqual(trimLeadingZeros([{ date: "m0", value: 0 }]), []);
});

test("normalization gives views per million views of the edition", () => {
  const article = [
    { date: "2024-01-01", value: 50 },
    { date: "2024-02-01", value: 50 },
  ];
  const totals = [
    { date: "2024-01-01", value: 1_000_000 },
    { date: "2024-02-01", value: 2_000_000 },
  ];

  assert.deepEqual(
    normalizePoints(article, totals).map(({ value }) => value),
    [50, 25],
  );
});

test("year over year compares the last 12 months with the previous 12", () => {
  const points = buildMonthlyPoints({
    startYear: 2023,
    months: 24,
    value: (index) => (index < 12 ? 100 : 150),
  });

  assert.equal(computeYoy(points), 50);
  assert.equal(computeYoy(points.slice(1)), null);
});

test("year over year uses the same calendar months, so seasonality cancels out", () => {
  const points = buildMonthlyPoints({
    startYear: 2023,
    months: 30,
    value: (index, month) => (month === 9 ? 500 : 100),
  });

  assert.equal(computeYoy(points), 0);
});

test("index: first 12 months = 100", () => {
  const points = buildMonthlyPoints({
    startYear: 2022,
    months: 36,
    value: (index) => (index < 12 ? 200 : index < 24 ? 300 : 100),
  });

  assert.equal(computeIndex(points), 50);
  assert.equal(toIndexPoints(points)[0].value, 100);
  assert.equal(toIndexPoints(points)[12].value, 150);
});
