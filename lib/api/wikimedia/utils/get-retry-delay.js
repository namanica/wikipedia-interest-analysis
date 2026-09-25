import { REQUEST_POLICY } from "../constants/index.js";

const MS_PER_SECOND = 1000;

const parseRetryAfter = (value) => {
  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (Number.isFinite(seconds)) {
    return seconds * MS_PER_SECOND;
  }

  const retryAt = Date.parse(value);

  return Number.isNaN(retryAt) ? null : Math.max(0, retryAt - Date.now());
};

export const getRetryDelay = (response, attempt) =>
  parseRetryAfter(response?.headers.get("retry-after")) ??
  REQUEST_POLICY.RETRY_DELAY_MS * REQUEST_POLICY.BACKOFF_FACTOR ** attempt;
