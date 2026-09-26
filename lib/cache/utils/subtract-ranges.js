import { addDays } from "#lib/utils/index.js";
import { mergeRanges } from "./merge-ranges.js";

export const subtractRanges = (range, covered) => {
  const gaps = [];
  let cursor = range.start;

  for (const { start, end } of mergeRanges(covered)) {
    if (start > range.end) {
      break;
    }

    if (start > cursor) {
      gaps.push({ start: cursor, end: addDays(start, -1) });
    }

    if (end >= cursor) {
      cursor = addDays(end, 1);
    }
  }

  if (cursor <= range.end) {
    gaps.push({ start: cursor, end: range.end });
  }

  return gaps;
};
