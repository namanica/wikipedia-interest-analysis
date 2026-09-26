import { test } from "node:test";
import assert from "node:assert/strict";
import { rankResults, buildLimitations } from "#lib/analysis/index.js";

const result = (lang, trendPct, confidence, views = 1000, yoy = trendPct) => ({
  lang,
  trend_pct_per_year: trendPct,
  yoy_growth_pct: yoy,
  confidence,
  avg_monthly_views: views,
  flags: confidence === "low" ? ["very_low_volume"] : [],
});

test("ranks by growth, with low confidence last", () => {
  const { order } = rankResults([
    result("pl", 5, "high"),
    result("cs", 40, "low", 20),
    result("sk", 12, "medium"),
    result("uk", -10, "high"),
  ]);

  assert.deepEqual(
    order.map(({ lang }) => lang),
    ["sk", "pl", "uk", "cs"],
  );
  assert.deepEqual(
    order.map(({ rank }) => rank),
    [1, 2, 3, 4],
  );
});

test("promising needs confidence, volume and growth over the thresholds", () => {
  const { order, criteria } = rankResults(
    [
      result("pl", 5, "high"),
      result("sk", 12, "medium", 200),
      result("uk", -10, "high"),
      result("cs", 40, "low"),
    ],
    { minMonthlyViews: 300, minGrowthPct: 0 },
  );
  const promising = Object.fromEntries(
    order.map(({ lang, promising: value }) => [lang, value]),
  );

  assert.deepEqual(promising, { pl: true, sk: false, uk: false, cs: false });
  assert.equal(criteria.min_monthly_views, 300);
});

test("the growth threshold is configurable and falls back to the trend without YoY", () => {
  const { order } = rankResults(
    [result("pl", 15, "high", 1000, null), result("de", 8, "high")],
    {
      minGrowthPct: 10,
    },
  );

  assert.deepEqual(
    order.map(({ promising }) => promising),
    [true, false],
  );
});

test("limitations list the general ones plus one sentence per flag present", () => {
  const limitations = buildLimitations([
    result("cs", 40, "low"),
    result("pl", 5, "high"),
  ]);

  assert.ok(limitations.general.length >= 3);
  assert.deepEqual(Object.keys(limitations), ["general", "very_low_volume"]);
  assert.match(limitations.very_low_volume, /Fewer than 50 views/);
});
