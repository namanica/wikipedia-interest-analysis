export const pickVariant = (variants, { raw, keepSpikes }) => {
  if (raw) {
    return keepSpikes ? variants.rawWithSpikes : variants.rawClean;
  }

  return keepSpikes ? variants.normalizedWithSpikes : variants.normalizedClean;
};
