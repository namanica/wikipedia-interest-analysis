import { CONFIDENCE } from "../constants/index.js";

export const isPromising = (result, { minMonthlyViews, minGrowthPct }) => {
  const growth = result.yoy_growth_pct ?? result.trend_pct_per_year;

  return (
    result.confidence !== CONFIDENCE.LOW &&
    result.avg_monthly_views >= minMonthlyViews &&
    growth >= minGrowthPct
  );
};
