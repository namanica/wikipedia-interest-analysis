import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { toSeries } from "#lib/api/wikimedia/to-series.js";
import { fetchEntity } from "#lib/api/wikimedia/fetch-entity.js";
import { searchEntities } from "#lib/api/wikimedia/search-entities.js";
import { buildArticleUrl } from "#lib/api/wikimedia/build-article-url.js";
import { buildProjectUrl } from "#lib/api/wikimedia/build-project-url.js";
import { createRequestCounter } from "#lib/api/wikimedia/index.js";

const loadFixture = async (name) =>
  JSON.parse(
    await readFile(
      new URL(`../../fixtures/wikimedia/${name}`, import.meta.url),
    ),
  );

const respondWith =
  (data, status = 200) =>
  async () => ({
    ok: status === 200,
    status,
    headers: new Headers(),
    json: async () => data,
  });

test("toSeries turns a daily API response into {date, value} points", async () => {
  const { items } = await loadFixture("per-article-daily.json");
  const series = toSeries({
    items,
    lang: "uk",
    article: "Астрономія",
    granularity: "daily",
  });

  assert.equal(series.lang, "uk");
  assert.equal(series.article, "Астрономія");
  assert.equal(series.points.length, items.length);
  assert.deepEqual(series.points[0], {
    date: "2026-01-01",
    value: items[0].views,
  });
  assert.ok(
    series.points.every(({ date }) => /^\d{4}-\d{2}-\d{2}$/.test(date)),
  );
});

test("toSeries gives an empty series when there are no items (404)", () => {
  const series = toSeries({
    items: undefined,
    lang: "uk",
    granularity: "daily",
  });

  assert.deepEqual(series, {
    lang: "uk",
    article: null,
    granularity: "daily",
    points: [],
  });
});

test("a 404 from the Pageviews API becomes an empty series, not an error", async () => {
  const { fetchPageviewsBatch } = await import("#lib/api/wikimedia/index.js");
  const notFound = await loadFixture("per-article-not-found.json");
  const counter = createRequestCounter();
  const [series] = await fetchPageviewsBatch({
    requests: [
      {
        lang: "uk",
        article: "Nonexistent zzz",
        start: "2026-01-01",
        end: "2026-01-05",
      },
    ],
    granularity: "daily",
    counter,
    fetch: respondWith(notFound, 404),
  });

  assert.deepEqual(series.points, []);
  assert.equal(counter.count(), 1);
});

test("article URLs encode titles and dates", () => {
  const url = buildArticleUrl({
    lang: "uk",
    article: " Інтервальне голодування ",
    granularity: "daily",
    start: "2024-01-01",
    end: "2024-12-31",
  });

  assert.equal(
    url,
    "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/uk.wikipedia/all-access/user/%D0%86%D0%BD%D1%82%D0%B5%D1%80%D0%B2%D0%B0%D0%BB%D1%8C%D0%BD%D0%B5_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B4%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F/daily/20240101/20241231",
  );
  assert.match(
    buildProjectUrl({
      lang: "pl",
      granularity: "monthly",
      start: "2024-01-01",
      end: "2024-12-31",
    }),
    /\/aggregate\/pl\.wikipedia\/all-access\/user\/monthly\/20240101\/20241231$/,
  );
});

test("searchEntities returns candidates with qid, label and description", async () => {
  const response = await loadFixture("wbsearchentities.json");
  const candidates = await searchEntities({
    query: "astronomy",
    queryLang: "en",
    counter: createRequestCounter(),
    fetch: respondWith(response),
  });

  assert.equal(candidates[0].qid, "Q333");
  assert.equal(candidates[0].label, "astronomy");
  assert.ok(
    candidates.every(
      ({ qid, label, description }) =>
        qid && label !== undefined && description !== undefined,
    ),
  );
});

test("fetchEntity maps sitelinks to titles and marks missing languages as null", async () => {
  const response = await loadFixture("wbgetentities.json");
  const entity = await fetchEntity({
    qid: "Q333",
    langs: ["uk", "pl", "xx"],
    counter: createRequestCounter(),
    fetch: respondWith(response),
  });

  assert.equal(entity.qid, "Q333");
  assert.equal(entity.label, "astronomy");
  assert.deepEqual(entity.titles, {
    uk: "Астрономія",
    pl: "Astronomia",
    xx: null,
  });
});

test("fetchEntity returns null for an item that does not exist", async () => {
  const response = await loadFixture("wbgetentities-missing.json");
  const entity = await fetchEntity({
    qid: "Q99999999999",
    langs: ["uk"],
    counter: createRequestCounter(),
    fetch: respondWith(response),
  });

  assert.equal(entity, null);
});
