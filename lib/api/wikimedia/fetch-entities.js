import { WIKIDATA_ACTION, WIKIDATA_LABEL_LANG } from "./constants/index.js";
import {
  assertWikidataResponse,
  buildWikidataUrl,
  toSiteId,
} from "./utils/index.js";
import { requestJson } from "./request-json.js";

const NO_SUCH_ENTITY = "no-such-entity";

const toEntity = ({ id, labels, descriptions, sitelinks = {} }, langs) => ({
  qid: id,
  label: labels?.[WIKIDATA_LABEL_LANG]?.value ?? null,
  description: descriptions?.[WIKIDATA_LABEL_LANG]?.value ?? null,
  titles: Object.fromEntries(
    langs.map((lang) => [lang, sitelinks[toSiteId(lang)]?.title ?? null]),
  ),
});

export const fetchEntities = async ({ ids, langs, counter, fetch }) => {
  const url = buildWikidataUrl({
    action: WIKIDATA_ACTION.GET_ENTITIES,
    ids: ids.join("|"),
    props: "labels|descriptions|sitelinks",
    languages: WIKIDATA_LABEL_LANG,
    sitefilter: langs.map(toSiteId).join("|"),
  });
  const response = await requestJson({ url, counter, fetch });

  if (response?.error?.code === NO_SUCH_ENTITY) {
    return [];
  }

  assertWikidataResponse(response);

  return Object.values(response.entities)
    .filter(({ missing }) => missing === undefined)
    .map((entity) => toEntity(entity, langs));
};
