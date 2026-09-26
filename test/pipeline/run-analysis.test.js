import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildReport,
  renderChart,
  resolveTopic,
  runAnalysis,
} from "#lib/pipeline/index.js";
import { createKeyValueCache, createSeriesCache } from "#lib/cache/index.js";
import { SkillError } from "#lib/utils/index.js";
import { createFakeWikimedia } from "#test/fixtures/fake-wikimedia.js";
import { createFakeWikidata } from "#test/fixtures/fake-wikidata.js";
import { createTempDir } from "#test/fixtures/temp-dir.js";
import { monthIndexOf } from "#test/fixtures/synthetic-series.js";

const CANDIDATES = [
  { qid: "Q333", label: "astronomy", description: "natural science" },
  {
    qid: "Q752075",
    label: "Astronomy and Astrophysics",
    description: "journal",
  },
];
const TITLES = { uk: "Астрономія", pl: "Astronomia", cs: "Astronomie" };

const setup = async () => {
  const wikimedia = createFakeWikimedia({
    article: (date) => 200 + 3 * monthIndexOf(date, 2023),
    total: () => 1_000_000,
    entities: createFakeWikidata({ candidates: CANDIDATES, titles: TITLES }),
  });

  return {
    wikimedia,
    options: {
      out: await createTempDir(),
      seriesCache: createSeriesCache({ dir: await createTempDir() }),
      topicCache: createKeyValueCache({ dir: await createTempDir() }),
      start: "2023-01-01",
      end: "2025-12-31",
      fetch: wikimedia.fetch,
      now: new Date("2026-09-26T12:00:00Z"),
    },
  };
};

test("resolveTopic reuses the cache and fetches titles only for new languages", async () => {
  const { wikimedia, options } = await setup();
  const base = {
    query: "astronomy",
    cache: options.topicCache,
    fetch: wikimedia.fetch,
  };

  const first = await resolveTopic({ ...base, langs: "uk,pl" });
  const again = await resolveTopic({ ...base, langs: "uk,pl" });
  const withSk = await resolveTopic({ ...base, langs: "uk,pl,sk" });

  assert.equal(first.networkRequests, 2);
  assert.equal(again.networkRequests, 0);
  assert.equal(withSk.networkRequests, 1);
  assert.match(wikimedia.calls.at(-1), /sitefilter=skwiki&|sitefilter=skwiki$/);
  assert.deepEqual(
    withSk.data.topic.articles.map(({ lang, status }) => `${lang}:${status}`),
    ["uk:found", "pl:found", "sk:missing"],
  );
  assert.equal(withSk.data.alternatives[0].qid, "Q752075");
});

test("one command: topic -> articles -> analysis -> saved run with ranking", async () => {
  const { options } = await setup();
  const result = await runAnalysis({
    ...options,
    topic: "astronomy",
    langs: "uk,pl,sk",
  });
  const manifest = JSON.parse(await readFile(result.files[0], "utf8"));

  assert.equal(result.networkRequests, 2 + 4);
  assert.deepEqual(result.data.topic.missing_langs, ["sk"]);
  assert.equal(result.data.results.length, 2);
  assert.equal(result.data.ranking.order.length, 2);
  assert.equal(manifest.run_id, result.data.run_id);
  assert.equal(manifest.chart_data.length, 2);
  assert.match(result.data.run_id, /^20260926120000-astronomy$/);
});

test("refining the same question runs from the cache", async () => {
  const { options } = await setup();

  await runAnalysis({ ...options, topic: "astronomy", langs: "uk,pl" });

  const keepSpikes = await runAnalysis({
    ...options,
    topic: "astronomy",
    langs: "uk,pl",
    keepSpikes: true,
    raw: true,
  });

  assert.equal(keepSpikes.networkRequests, 0);
  assert.equal(keepSpikes.data.assumptions.normalization, "none");
});

test("the request guard stops large runs until --confirm", async () => {
  const { options } = await setup();
  const langs = "uk,pl,cs,de,fr,es,it,sk,sv,fi,no";
  const titles = Object.fromEntries(
    langs.split(",").map((lang) => [lang, `Title ${lang}`]),
  );
  const fake = createFakeWikimedia({
    article: () => 100,
    total: () => 1_000_000,
    entities: createFakeWikidata({ candidates: CANDIDATES, titles }),
  });
  const guarded = await runAnalysis({
    ...options,
    fetch: fake.fetch,
    topic: "astronomy",
    langs,
  });

  assert.equal(guarded.data.estimated_requests, 22);
  assert.equal(guarded.networkRequests, 2);
  assert.ok(fake.calls.every((url) => url.includes("wikidata.org")));

  const confirmed = await runAnalysis({
    ...options,
    fetch: fake.fetch,
    topic: "astronomy",
    langs,
    confirm: true,
  });

  assert.equal(confirmed.data.results.length, 11);
  assert.equal(confirmed.networkRequests, 22);
});

test("no article in any language is a user error with a hint", async () => {
  const { options } = await setup();

  await assert.rejects(
    runAnalysis({ ...options, topic: "astronomy", langs: "sk,hu" }),
    (error) =>
      error instanceof SkillError &&
      /No Wikipedia articles/.test(error.message),
  );
});

test("chart and one-page PDF are built from the saved run", async () => {
  const { options } = await setup();
  const run = await runAnalysis({
    ...options,
    topic: "astronomy",
    langs: "uk,pl",
    chart: true,
  });
  const png = await readFile(run.files.find((file) => file.endsWith(".png")));

  assert.deepEqual(
    [...png.subarray(1, 4)].map((byte) => String.fromCharCode(byte)).join(""),
    "PNG",
  );

  const chart = await renderChart({ run: "latest", out: options.out });
  const report = await buildReport({
    run: run.data.run_id,
    out: options.out,
    locale: "uk",
    summary: "Інтерес до астрономії зростає в обох мовах.",
  });
  const pdf = await readFile(report.files[0]);
  const pages = pdf.toString("latin1").match(/\/Type \/Page\b/g);

  assert.equal(chart.networkRequests, 0);
  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  assert.equal(pages.length, 1);
});

test("an over-long summary is refused before the PDF is built", async () => {
  const { options } = await setup();
  const run = await runAnalysis({
    ...options,
    topic: "astronomy",
    langs: "uk,pl",
  });

  await assert.rejects(
    buildReport({
      run: run.data.run_id,
      out: options.out,
      summary: "x".repeat(701),
    }),
    /--summary is 701 characters/,
  );
});
