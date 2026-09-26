import { WIKIDATA_ACTION, WIKIDATA_LABEL_LANG } from "./constants/index.js";
import { assertWikidataResponse, buildWikidataUrl } from "./utils/index.js";
import { requestJson } from "./request-json.js";

const SEARCH_LIMIT = 5;

export const searchEntities = async ({ query, queryLang, counter, fetch }) => {
  const url = buildWikidataUrl({
    action: WIKIDATA_ACTION.SEARCH_ENTITIES,
    search: query,
    language: queryLang,
    uselang: WIKIDATA_LABEL_LANG,
    type: "item",
    limit: SEARCH_LIMIT,
  });
  const response = await requestJson({ url, counter, fetch });

  assertWikidataResponse(response);

  return (response?.search ?? []).map(({ id, label, description }) => ({
    qid: id,
    label: label ?? null,
    description: description ?? null,
  }));
};
