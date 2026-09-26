import { WIKIDATA_ACTION, WIKIDATA_LABEL_LANG } from "./constants/index.js";
import {
  assertWikidataResponse,
  buildWikidataUrl,
  toSiteId,
} from "./utils/index.js";
import { requestJson } from "./request-json.js";

const NO_SUCH_ENTITY = "no-such-entity";

export const fetchEntity = async ({ qid, langs, counter, fetch }) => {
  const url = buildWikidataUrl({
    action: WIKIDATA_ACTION.GET_ENTITIES,
    ids: qid,
    props: "labels|descriptions|sitelinks",
    languages: WIKIDATA_LABEL_LANG,
    sitefilter: langs.map(toSiteId).join("|"),
  });
  const response = await requestJson({ url, counter, fetch });

  if (response?.error?.code === NO_SUCH_ENTITY) {
    return null;
  }

  assertWikidataResponse(response);

  const [entity] = Object.values(response.entities);
  const { id, labels, descriptions, sitelinks = {} } = entity;
  const titles = Object.fromEntries(
    langs.map((lang) => [lang, sitelinks[toSiteId(lang)]?.title ?? null]),
  );

  return {
    qid: id,
    label: labels?.[WIKIDATA_LABEL_LANG]?.value ?? null,
    description: descriptions?.[WIKIDATA_LABEL_LANG]?.value ?? null,
    titles,
  };
};
