import { WIKIDATA_API_URL } from "../constants/index.js";

export const buildWikidataUrl = (params) => {
  const query = new URLSearchParams({ ...params, format: "json" });

  return `${WIKIDATA_API_URL}?${query}`;
};
