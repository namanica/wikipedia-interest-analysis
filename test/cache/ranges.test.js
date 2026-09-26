import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeRanges } from "#lib/cache/utils/merge-ranges.js";
import { subtractRanges } from "#lib/cache/utils/subtract-ranges.js";
import { splitByFreshness } from "#lib/cache/utils/split-by-freshness.js";
import { mergePoints } from "#lib/cache/utils/merge-points.js";

const range = (start, end) => ({ start, end });

test("merges overlapping and adjacent ranges", () => {
  assert.deepEqual(
    mergeRanges([
      range("2024-03-01", "2024-03-31"),
      range("2024-01-01", "2024-01-31"),
      range("2024-02-01", "2024-02-10"),
      range("2024-03-15", "2024-04-05"),
    ]),
    [range("2024-01-01", "2024-02-10"), range("2024-03-01", "2024-04-05")],
  );
});

test("missing ranges: nothing cached, all cached, gaps on both sides and inside", () => {
  const wanted = range("2024-01-01", "2024-12-31");

  assert.deepEqual(subtractRanges(wanted, []), [wanted]);
  assert.deepEqual(
    subtractRanges(wanted, [range("2023-01-01", "2025-01-01")]),
    [],
  );
  assert.deepEqual(
    subtractRanges(wanted, [
      range("2024-03-01", "2024-05-31"),
      range("2024-08-01", "2024-09-30"),
    ]),
    [
      range("2024-01-01", "2024-02-29"),
      range("2024-06-01", "2024-07-31"),
      range("2024-10-01", "2024-12-31"),
    ],
  );
});

test("extending the period only asks for the new part", () => {
  const cached = [range("2023-09-01", "2026-08-31")];

  assert.deepEqual(subtractRanges(range("2021-09-01", "2026-08-31"), cached), [
    range("2021-09-01", "2023-08-31"),
  ]);
});

test("the last 3 days before today are recent, older days are settled", () => {
  assert.deepEqual(
    splitByFreshness(range("2026-09-01", "2026-09-25"), "2026-09-26"),
    {
      settled: [range("2026-09-01", "2026-09-23")],
      recent: [range("2026-09-24", "2026-09-25")],
    },
  );
  assert.deepEqual(
    splitByFreshness(range("2025-01-01", "2025-12-31"), "2026-09-26"),
    {
      settled: [range("2025-01-01", "2025-12-31")],
      recent: [],
    },
  );
  assert.deepEqual(
    splitByFreshness(range("2026-09-25", "2026-09-25"), "2026-09-26"),
    {
      settled: [],
      recent: [range("2026-09-25", "2026-09-25")],
    },
  );
});

test("refetched ranges replace old points, including days that became empty", () => {
  const current = [
    { date: "2024-01-01", value: 1 },
    { date: "2024-01-02", value: 2 },
    { date: "2024-01-03", value: 3 },
  ];
  const merged = mergePoints(
    current,
    [{ date: "2024-01-03", value: 30 }],
    range("2024-01-02", "2024-01-03"),
  );

  assert.deepEqual(merged, [
    { date: "2024-01-01", value: 1 },
    { date: "2024-01-03", value: 30 },
  ]);
});
