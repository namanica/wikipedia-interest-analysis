export const orderByRanking = ({ results, ranking }) => {
  if (!ranking) {
    return results;
  }

  const rankByLang = new Map(
    ranking.order.map(({ lang, rank }) => [lang, rank]),
  );

  return [...results].sort(
    (a, b) => rankByLang.get(a.lang) - rankByLang.get(b.lang),
  );
};
