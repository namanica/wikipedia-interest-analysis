import { SPIKE_RULE } from "../constants/index.js";
import { median } from "./median.js";

const MAD_SCALE = 0.6745;
const HALF = 2;

const getWindow = (values, index) => {
  const radius = Math.floor(SPIKE_RULE.WINDOW_DAYS / HALF);

  return values.slice(Math.max(0, index - radius), index + radius + 1);
};

const checkSpike = (value, window) => {
  const expected = median(window);
  const deviations = window.map((item) => Math.abs(item - expected));
  const spread = Math.max(median(deviations), Math.sqrt(expected), 1);
  const modifiedZ = (MAD_SCALE * (value - expected)) / spread;
  const isSpike =
    modifiedZ > SPIKE_RULE.MIN_MODIFIED_Z &&
    value > expected * SPIKE_RULE.MIN_RATIO_TO_MEDIAN;

  return { isSpike, expected };
};

export const detectSpikes = (points) => {
  const values = points.map(({ value }) => value);
  const checks = points.map(({ value }, index) =>
    checkSpike(value, getWindow(values, index)),
  );
  const cleaned = points.map((point, index) =>
    checks[index].isSpike ? { ...point, value: checks[index].expected } : point,
  );
  const spikes = points.flatMap(({ date, value }, index) =>
    checks[index].isSpike
      ? [{ date, value, expected: checks[index].expected }]
      : [],
  );

  return { cleaned, spikes };
};
