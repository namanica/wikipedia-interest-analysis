import { setTimeout as sleep } from "node:timers/promises";
import { SkillError, EXIT_CODES } from "#lib/utils/index.js";
import { HTTP_STATUS, REQUEST_POLICY } from "./constants/index.js";
import { getRetryDelay, isRetryable, sendRequest } from "./utils/index.js";

export const requestJson = async ({
  url,
  counter,
  fetch = globalThis.fetch,
  wait = sleep,
  attempt = 0,
}) => {
  counter.increment();
  const response = await sendRequest({ url, fetch });

  if (response?.status === HTTP_STATUS.NOT_FOUND) {
    return null;
  }

  if (response?.ok) {
    return response.json();
  }

  if (isRetryable(response) && attempt < REQUEST_POLICY.MAX_RETRIES) {
    await wait(getRetryDelay(response, attempt));

    return requestJson({ url, counter, fetch, wait, attempt: attempt + 1 });
  }

  throw new SkillError({
    message: `Wikimedia API request failed (${response?.status ?? "no response"}): ${url}`,
    hint: "Check the internet connection and try again in a minute.",
    exitCode: EXIT_CODES.NETWORK_ERROR,
  });
};
