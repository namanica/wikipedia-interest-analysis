import { addDays } from "#lib/utils/index.js";

const byStart = (a, b) => a.start.localeCompare(b.start);

export const mergeRanges = (ranges) =>
  [...ranges].sort(byStart).reduce((merged, range) => {
    const last = merged.at(-1);
    const isTouching = last && range.start <= addDays(last.end, 1);

    if (!isTouching) {
      return [...merged, range];
    }

    const end = range.end > last.end ? range.end : last.end;

    return [...merged.slice(0, -1), { start: last.start, end }];
  }, []);
