import { test } from "node:test";
import assert from "node:assert/strict";
import { requestJson } from "#lib/api/wikimedia/request-json.js";
import { createRequestCounter } from "#lib/api/wikimedia/index.js";
import { SkillError } from "#lib/utils/index.js";

const response = (status, { data = {}, headers = {} } = {}) => ({
  ok: status === 200,
  status,
  headers: new Headers(headers),
  json: async () => data,
});

const sequence = (...responses) => {
  let index = 0;

  return async () => {
    const next = responses[index];

    index += 1;

    if (next instanceof Error) {
      throw next;
    }

    return next;
  };
};

test("retries 5xx and network failures, then returns the data", async () => {
  const counter = createRequestCounter();
  const delays = [];
  const data = await requestJson({
    url: "https://example.org",
    counter,
    fetch: sequence(
      response(503),
      new Error("socket hang up"),
      response(200, { data: { ok: 1 } }),
    ),
    wait: async (ms) => delays.push(ms),
  });

  assert.deepEqual(data, { ok: 1 });
  assert.equal(counter.count(), 3);
  assert.deepEqual(delays, [1000, 2000]);
});

test("waits for Retry-After on 429", async () => {
  const delays = [];

  await requestJson({
    url: "https://example.org",
    counter: createRequestCounter(),
    fetch: sequence(
      response(429, { headers: { "retry-after": "7" } }),
      response(200),
    ),
    wait: async (ms) => delays.push(ms),
  });

  assert.deepEqual(delays, [7000]);
});

test("returns null on 404 without retrying", async () => {
  const counter = createRequestCounter();
  const data = await requestJson({
    url: "https://example.org",
    counter,
    fetch: sequence(response(404)),
    wait: async () => {},
  });

  assert.equal(data, null);
  assert.equal(counter.count(), 1);
});

test("gives up after the retry limit with a network error", async () => {
  const counter = createRequestCounter();

  await assert.rejects(
    requestJson({
      url: "https://example.org",
      counter,
      fetch: async () => response(500),
      wait: async () => {},
    }),
    (error) => error instanceof SkillError && error.exitCode === 2,
  );
  assert.equal(counter.count(), 4);
});

test("does not retry other 4xx errors", async () => {
  const counter = createRequestCounter();

  await assert.rejects(
    requestJson({
      url: "https://example.org",
      counter,
      fetch: sequence(response(400)),
      wait: async () => {},
    }),
    SkillError,
  );
  assert.equal(counter.count(), 1);
});
