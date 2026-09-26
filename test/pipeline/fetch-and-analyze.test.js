import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeInterest, fetchPageviews } from "#lib/pipeline/index.js";
import { createSeriesCache } from "#lib/cache/index.js";
import { createFakeWikimedia } from "#test/fixtures/fake-wikimedia.js";
import { createTempDir } from "#test/fixtures/temp-dir.js";
import { monthIndexOf } from "#test/fixtures/synthetic-series.js";

const growingArticle = (date) => 100 + 5 * monthIndexOf(date, 2023);
const flatEdition = () => 1_000_000;

test("second identical run uses the cache: network_requests = 0", async () => {
  const cache = createSeriesCache({ dir: await createTempDir() });
  const wikimedia = createFakeWikimedia({
    article: growingArticle,
    total: flatEdition,
  });
  const options = {
    articles: ["uk:Астрономія"],
    start: "2023-01-01",
    end: "2025-12-31",
    cache,
    fetch: wikimedia.fetch,
  };

  const first = await analyzeInterest(options);
  const second = await analyzeInterest(options);

  assert.equal(first.networkRequests, 2);
  assert.equal(second.networkRequests, 0);
  assert.deepEqual(second.data.results, first.data.results);
  assert.equal(first.data.results[0].trend, "growing");
});

test("a longer period downloads only the missing years", async () => {
  const dir = await createTempDir();
  const wikimedia = createFakeWikimedia({
    article: growingArticle,
    total: flatEdition,
  });
  const base = {
    articles: ["uk:Астрономія"],
    end: "2025-12-31",
    fetch: wikimedia.fetch,
  };

  await analyzeInterest({
    ...base,
    start: "2024-01-01",
    cache: createSeriesCache({ dir }),
  });
  wikimedia.calls.length = 0;

  const extended = await analyzeInterest({
    ...base,
    start: "2022-01-01",
    cache: createSeriesCache({ dir }),
  });

  assert.equal(extended.networkRequests, 2);
  assert.ok(
    wikimedia.calls.every((url) => url.endsWith("/daily/20220101/20231231")),
  );
  assert.equal(extended.data.results[0].months, 48);
});

test("the edition total is shared between topics of the same language", async () => {
  const cache = createSeriesCache({ dir: await createTempDir() });
  const wikimedia = createFakeWikimedia({
    article: growingArticle,
    total: flatEdition,
  });
  const period = {
    start: "2024-01-01",
    end: "2025-12-31",
    cache,
    fetch: wikimedia.fetch,
  };

  await analyzeInterest({ articles: ["uk:Астрономія"], ...period });
  const second = await analyzeInterest({
    articles: ["uk:Телескоп"],
    ...period,
  });

  assert.equal(second.networkRequests, 1);
});

test("a missing article gives a hint, not an error", async () => {
  const cache = createSeriesCache({ dir: await createTempDir() });
  const wikimedia = createFakeWikimedia({ article: null, total: flatEdition });
  const result = await analyzeInterest({
    articles: ["uk:Немає такої"],
    start: "2024-01-01",
    end: "2025-12-31",
    cache,
    fetch: wikimedia.fetch,
  });

  assert.deepEqual(result.data.results, []);
  assert.match(
    result.hints[0],
    /No pageviews for "Немає такої" in uk\.wikipedia/,
  );
});

test("monthly fetch sums cached daily data into full months", async () => {
  const cache = createSeriesCache({ dir: await createTempDir() });
  const wikimedia = createFakeWikimedia({
    article: () => 10,
    total: flatEdition,
  });
  const result = await fetchPageviews({
    articles: ["uk:Астрономія"],
    granularity: "monthly",
    start: "2024-01-15",
    end: "2024-04-10",
    cache,
    fetch: wikimedia.fetch,
  });

  assert.deepEqual(result.data.period, {
    start: "2024-02-01",
    end: "2024-03-31",
  });
  assert.deepEqual(result.data.series[0].values, [
    { date: "2024-02-01", value: 290 },
    { date: "2024-03-01", value: 310 },
  ]);
});
