export const getCoveredRanges = ({ ranges, recent }, today) =>
  recent.fetchedOn === today ? [...ranges, ...recent.ranges] : ranges;
