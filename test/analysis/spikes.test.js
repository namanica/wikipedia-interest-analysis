import { test } from "node:test";
import assert from "node:assert/strict";
import { detectSpikes } from "#lib/analysis/utils/detect-spikes.js";
import { buildDailyPoints, noise } from "#test/fixtures/synthetic-series.js";

const SPIKE_DATE = "2024-03-15";

test("a one-day spike is detected and replaced by the rolling median", () => {
  const daily = buildDailyPoints({
    start: "2024-01-01",
    end: "2024-06-30",
    value: (date, index) => (date === SPIKE_DATE ? 5000 : 100 + noise(index)),
  });
  const { cleaned, spikes } = detectSpikes(daily);
  const cleanedSpike = cleaned.find(({ date }) => date === SPIKE_DATE);

  assert.deepEqual(
    spikes.map(({ date }) => date),
    [SPIKE_DATE],
  );
  assert.equal(spikes[0].value, 5000);
  assert.ok(cleanedSpike.value >= 95 && cleanedSpike.value <= 105);
});

test("ordinary noise and weekly patterns are not spikes", () => {
  const daily = buildDailyPoints({
    start: "2024-01-01",
    end: "2024-12-31",
    value: (date, index) => (index % 7 < 5 ? 120 : 80) + noise(index),
  });

  assert.equal(detectSpikes(daily).spikes.length, 0);
});

test("a gradual rise is a trend, not a spike", () => {
  const daily = buildDailyPoints({
    start: "2024-01-01",
    end: "2024-12-31",
    value: (date, index) => 100 + index,
  });

  assert.equal(detectSpikes(daily).spikes.length, 0);
});

test("small counts need a real jump to count as a spike", () => {
  const daily = buildDailyPoints({
    start: "2024-01-01",
    end: "2024-03-31",
    value: (date, index) => (index % 3 === 0 ? 2 : 1),
  });

  assert.equal(detectSpikes(daily).spikes.length, 0);
});
