import { fetchEntity } from "#lib/api/wikimedia/index.js";
import { SkillError } from "#lib/utils/index.js";

export const loadEntity = async ({ qid, langs, cache, counter, fetch }) => {
  const key = JSON.stringify({ type: "wikidata-entity", qid });
  const cached = await cache.get(key);
  const missingLangs = langs.filter(
    (lang) => !(lang in (cached?.titles ?? {})),
  );

  if (cached && !missingLangs.length) {
    return cached;
  }

  const fetched = await fetchEntity({
    qid,
    langs: missingLangs,
    counter,
    fetch,
  });

  if (!fetched) {
    throw new SkillError({
      message: `Wikidata item ${qid} does not exist.`,
      hint: "Run resolve-topic.js with --query instead of --qid.",
    });
  }

  const entity = {
    ...fetched,
    titles: { ...cached?.titles, ...fetched.titles },
  };

  await cache.set(key, entity);

  return entity;
};
