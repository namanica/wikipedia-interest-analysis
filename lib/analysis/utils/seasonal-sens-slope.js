import { groupBySeason } from "./group-by-season.js";
import { median } from "./median.js";

const toPairSlopes = (season) =>
  season.flatMap((first, i) =>
    season
      .slice(i + 1)
      .map(
        (second) => (second.value - first.value) / (second.year - first.year),
      ),
  );

export const seasonalSensSlope = (points) => {
  const slopes = groupBySeason(points).flatMap(toPairSlopes);

  return slopes.length ? median(slopes) : 0;
};
