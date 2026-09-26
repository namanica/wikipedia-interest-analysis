import { searchEntities } from "#lib/api/wikimedia/index.js";
import { SkillError } from "#lib/utils/index.js";

export const searchCandidates = async ({
  query,
  queryLang,
  cache,
  counter,
  fetch,
}) => {
  const normalizedQuery = query.trim().toLowerCase();
  const key = JSON.stringify({
    type: "wikidata-search",
    query: normalizedQuery,
    queryLang,
  });
  const cached = await cache.get(key);
  const candidates =
    cached ??
    (await searchEntities({
      query: normalizedQuery,
      queryLang,
      counter,
      fetch,
    }));

  if (!cached && candidates.length) {
    await cache.set(key, candidates);
  }

  if (!candidates.length) {
    throw new SkillError({
      message: `No Wikidata topic found for "${query}" (search language: ${queryLang}).`,
      hint: "Try the English name of the topic, or pass --query-lang with the language of the query, for example --query-lang uk.",
    });
  }

  return candidates;
};
