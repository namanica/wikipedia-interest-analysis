export const mapWithConcurrency = async (items, limit, mapper) => {
  const results = [];
  let nextIndex = 0;

  const runWorker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;

      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  };

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    runWorker,
  );

  await Promise.all(workers);

  return results;
};
