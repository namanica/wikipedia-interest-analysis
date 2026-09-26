import { mergePoints } from "./merge-points.js";
import { mergeRanges } from "./merge-ranges.js";
import { splitByFreshness } from "./split-by-freshness.js";

export const addToEntry = (entry, { start, end, points }, today) => {
  const { settled, recent } = splitByFreshness({ start, end }, today);
  const keptRecent =
    entry.recent.fetchedOn === today ? entry.recent.ranges : [];

  return {
    ...entry,
    ranges: mergeRanges([...entry.ranges, ...settled]),
    recent: {
      fetchedOn: today,
      ranges: mergeRanges([...keptRecent, ...recent]),
    },
    points: mergePoints(entry.points, points, { start, end }),
  };
};
