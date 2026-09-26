import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveFetchPeriod } from "#lib/pipeline/utils/resolve-fetch-period.js";
import { parseArticleTarget } from "#lib/pipeline/utils/parse-article-target.js";
import { parseLangList } from "#lib/pipeline/utils/parse-lang-list.js";
import { parseYears } from "#lib/pipeline/utils/parse-years.js";
import { SkillError } from "#lib/utils/index.js";

test("--years N gives exactly N x 12 full months ending with the last full month", () => {
  assert.deepEqual(
    resolveFetchPeriod({ end: "2026-09-25", years: 2, granularity: "monthly" }),
    {
      start: "2024-09-01",
      end: "2026-08-31",
    },
  );
  assert.deepEqual(
    resolveFetchPeriod({ end: "2026-08-31", granularity: "monthly" }),
    {
      start: "2023-09-01",
      end: "2026-08-31",
    },
  );
});

test("an explicit --start is aligned to the next full month", () => {
  assert.deepEqual(
    resolveFetchPeriod({
      start: "2024-01-15",
      end: "2024-12-31",
      granularity: "monthly",
    }),
    { start: "2024-02-01", end: "2024-12-31" },
  );
});

test("article targets keep colons inside titles", () => {
  assert.deepEqual(parseArticleTarget("en:Star Wars: Andor"), {
    lang: "en",
    article: "Star Wars: Andor",
  });
  assert.throws(() => parseArticleTarget("Астрономія"), SkillError);
});

test("language lists are validated and deduplicated", () => {
  assert.deepEqual(parseLangList("pl, cs,pl"), ["pl", "cs"]);
  assert.throws(() => parseLangList(""), SkillError);
  assert.throws(() => parseLangList("pl,Polish!"), SkillError);
});

test("years must be a whole number from 1 to 10", () => {
  assert.equal(parseYears("5"), 5);
  assert.equal(parseYears(undefined), undefined);
  assert.throws(() => parseYears("0"), SkillError);
  assert.throws(() => parseYears("2.5"), SkillError);
  assert.throws(() => parseYears("20"), SkillError);
});
