export const createEmptyEntry = (key) => ({
  key,
  ranges: [],
  recent: { fetchedOn: null, ranges: [] },
  points: [],
});
