import { WIKIDATA_ACTION, WIKIDATA_PROPERTY } from "./constants/index.js";
import { assertWikidataResponse, buildWikidataUrl } from "./utils/index.js";
import { requestJson } from "./request-json.js";

const toTargetIds = (claims = []) =>
  claims.map(({ mainsnak }) => mainsnak?.datavalue?.value?.id).filter(Boolean);

export const fetchParentIds = async ({ qid, counter, fetch }) => {
  const url = buildWikidataUrl({
    action: WIKIDATA_ACTION.GET_ENTITIES,
    ids: qid,
    props: "claims",
  });
  const response = await requestJson({ url, counter, fetch });

  assertWikidataResponse(response);

  const [entity] = Object.values(response.entities ?? {});
  const claims = entity?.claims ?? {};

  return Object.values(WIKIDATA_PROPERTY).flatMap((property) =>
    toTargetIds(claims[property]),
  );
};
