import { fetchEntities } from "./fetch-entities.js";

export const fetchEntity = async ({ qid, langs, counter, fetch }) => {
  const [entity = null] = await fetchEntities({
    ids: [qid],
    langs,
    counter,
    fetch,
  });

  return entity;
};
