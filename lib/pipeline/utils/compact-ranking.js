const MAX_FULL_RANKING = 3;

export const compactRanking = (ranking) => {
  if (!ranking || ranking.order.length <= MAX_FULL_RANKING) {
    return ranking;
  }

  const { order, ...rest } = ranking;

  return {
    ...rest,
    order: order.map(({ lang }) => lang),
    promising: order
      .filter(({ promising }) => promising)
      .map(({ lang }) => lang),
  };
};
