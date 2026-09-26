import { CONFIDENCE, PROMISING_CRITERIA } from "./constants/index.js";
import { isPromising } from "./utils/index.js";

const byConfidenceThenGrowth = (a, b) => {
  const aLow = a.confidence === CONFIDENCE.LOW;
  const bLow = b.confidence === CONFIDENCE.LOW;

  return aLow - bLow || b.trend_pct_per_year - a.trend_pct_per_year;
};

export const rankResults = (
  results,
  {
    minMonthlyViews = PROMISING_CRITERIA.MIN_MONTHLY_VIEWS,
    minGrowthPct = PROMISING_CRITERIA.MIN_GROWTH_PCT,
  } = {},
) => {
  const criteria = { minMonthlyViews, minGrowthPct };
  const ranked = [...results].sort(byConfidenceThenGrowth);

  return {
    criteria: {
      min_monthly_views: minMonthlyViews,
      min_growth_pct: minGrowthPct,
      order: "growth, low-confidence results last",
    },
    order: ranked.map((result, index) => ({
      rank: index + 1,
      lang: result.lang,
      promising: isPromising(result, criteria),
    })),
  };
};
