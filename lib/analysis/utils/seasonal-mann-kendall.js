import { groupBySeason } from "./group-by-season.js";

const VARIANCE_DIVISOR = 18;
const VARIANCE_OFFSET = 5;
const ERF = {
  P: 0.3275911,
  A1: 0.254829592,
  A2: -0.284496736,
  A3: 1.421413741,
  A4: -1.453152027,
  A5: 1.061405429,
};
const HALF = 2;

const erf = (x) => {
  const t = 1 / (1 + ERF.P * Math.abs(x));
  const poly =
    t * (ERF.A1 + t * (ERF.A2 + t * (ERF.A3 + t * (ERF.A4 + t * ERF.A5))));
  const result = 1 - poly * Math.exp(-x * x);

  return x < 0 ? -result : result;
};

const normalCdf = (z) => (1 + erf(z / Math.SQRT2)) / HALF;

const pairTerm = (count) =>
  (count * (count - 1) * (HALF * count + VARIANCE_OFFSET)) / VARIANCE_DIVISOR;

const scoreSeason = (season) => {
  const values = season.map(({ value }) => value);
  const ties = [...new Set(values)].map(
    (value) => values.filter((item) => item === value).length,
  );
  const s = values.reduce(
    (sum, value, i) =>
      sum +
      values
        .slice(i + 1)
        .reduce((acc, next) => acc + Math.sign(next - value), 0),
    0,
  );
  const variance =
    pairTerm(values.length) - ties.reduce((sum, t) => sum + pairTerm(t), 0);

  return { s, variance };
};

export const seasonalMannKendall = (points) => {
  const scores = groupBySeason(points).map(scoreSeason);
  const s = scores.reduce((sum, score) => sum + score.s, 0);
  const variance = scores.reduce((sum, score) => sum + score.variance, 0);

  if (!variance) {
    return { s, pValue: 1 };
  }

  const z = (s - Math.sign(s)) / Math.sqrt(variance);
  const pValue = HALF * (1 - normalCdf(Math.abs(z)));

  return { s, pValue };
};
