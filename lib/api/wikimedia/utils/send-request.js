import { REQUEST_POLICY, USER_AGENT } from "../constants/index.js";

export const sendRequest = ({ url, fetch }) =>
  fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_POLICY.TIMEOUT_MS),
  }).catch(() => null);
