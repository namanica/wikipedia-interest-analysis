import { fetchEntities, fetchParentIds } from "#lib/api/wikimedia/index.js";

const MAX_BROADER_TOPICS = 2;

const loadBroaderTopics = async ({ qid, langs, counter, fetch }) => {
  const parentIds = await fetchParentIds({ qid, counter, fetch });

  if (!parentIds.length) {
    return [];
  }

  const parents = await fetchEntities({
    ids: parentIds,
    langs,
    counter,
    fetch,
  });

  return parents
    .map(({ qid: parentQid, label, description, titles }) => ({
      qid: parentQid,
      label,
      description,
      langs: langs.filter((lang) => titles[lang]),
    }))
    .filter(({ langs: covered }) => covered.length)
    .sort((a, b) => b.langs.length - a.langs.length)
    .slice(0, MAX_BROADER_TOPICS);
};

export const findBroaderTopics = async ({
  qid,
  langs,
  cache,
  counter,
  fetch,
}) => {
  if (!langs.length) {
    return [];
  }

  const key = JSON.stringify({ type: "wikidata-broader", qid, langs });
  const cached = await cache.get(key);

  if (cached) {
    return cached;
  }

  const broader = await loadBroaderTopics({ qid, langs, counter, fetch });

  await cache.set(key, broader);

  return broader;
};
