import { HTTP_STATUS } from "../constants/index.js";

export const isRetryable = (response) =>
  !response ||
  response.status === HTTP_STATUS.TOO_MANY_REQUESTS ||
  response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
