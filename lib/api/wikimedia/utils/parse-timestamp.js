const TIMESTAMP_PATTERN = /^(\d{4})(\d{2})(\d{2})\d{2}$/;
const ISO_DATE_REPLACEMENT = "$1-$2-$3";

export const parseTimestamp = (timestamp) =>
  timestamp.replace(TIMESTAMP_PATTERN, ISO_DATE_REPLACEMENT);
