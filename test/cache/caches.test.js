import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createKeyValueCache, createSeriesCache } from "#lib/cache/index.js";
import { createTempDir } from "#test/fixtures/temp-dir.js";

const KEY = JSON.stringify({ lang: "uk", article: "Астрономія" });
const at = (iso) => () => new Date(iso);

test("series cache stores points and coverage on disk", async () => {
  const dir = await createTempDir();
  const writer = createSeriesCache({ dir, now: at("2026-09-26T10:00:00Z") });

  await writer.set(KEY, {
    start: "2026-01-01",
    end: "2026-01-31",
    points: [{ date: "2026-01-05", value: 7 }],
  });

  const reader = createSeriesCache({ dir, now: at("2026-09-26T18:00:00Z") });

  assert.deepEqual(
    await reader.missingRanges(KEY, { start: "2026-01-01", end: "2026-01-31" }),
    [],
  );
  assert.deepEqual(
    await reader.get(KEY, { start: "2026-01-01", end: "2026-01-31" }),
    [{ date: "2026-01-05", value: 7 }],
  );
  assert.equal((await readdir(dir)).length, 1);
});

test("recent days count as cached for the same UTC day only", async () => {
  const dir = await createTempDir();
  const period = { start: "2026-09-01", end: "2026-09-25" };

  await createSeriesCache({ dir, now: at("2026-09-26T08:00:00Z") }).set(KEY, {
    ...period,
    points: [],
  });

  const sameDay = createSeriesCache({ dir, now: at("2026-09-26T23:00:00Z") });
  const nextDay = createSeriesCache({ dir, now: at("2026-09-27T01:00:00Z") });

  assert.deepEqual(await sameDay.missingRanges(KEY, period), []);
  assert.deepEqual(await nextDay.missingRanges(KEY, period), [
    { start: "2026-09-24", end: "2026-09-25" },
  ]);
});

test("a corrupt cache file is treated as empty", async () => {
  const dir = await createTempDir();
  const cache = createSeriesCache({ dir });

  await cache.set(KEY, { start: "2026-01-01", end: "2026-01-02", points: [] });

  const [file] = await readdir(dir);

  await writeFile(join(dir, file), "{not json");

  const fresh = createSeriesCache({ dir });

  assert.equal(
    (await fresh.missingRanges(KEY, { start: "2026-01-01", end: "2026-01-02" }))
      .length,
    1,
  );
});

test("key-value cache expires after its TTL", async () => {
  const dir = await createTempDir();

  await createKeyValueCache({ dir, now: at("2026-01-01T00:00:00Z") }).set("k", {
    qid: "Q333",
  });

  assert.deepEqual(
    await createKeyValueCache({ dir, now: at("2026-01-20T00:00:00Z") }).get(
      "k",
    ),
    { qid: "Q333" },
  );
  assert.equal(
    await createKeyValueCache({ dir, now: at("2026-02-15T00:00:00Z") }).get(
      "k",
    ),
    null,
  );
  assert.equal(await createKeyValueCache({ dir }).get("missing"), null);
});
