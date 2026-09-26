export const addTotalTargets = (articleTargets) => {
  const langs = [...new Set(articleTargets.map(({ lang }) => lang))];
  const totalTargets = langs.map((lang) => ({ lang, article: null }));

  return [...articleTargets, ...totalTargets];
};
