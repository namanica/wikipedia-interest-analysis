import { createRequestCounter } from "#lib/api/wikimedia/index.js";
import { createKeyValueCache } from "#lib/cache/index.js";
import { SkillError } from "#lib/utils/index.js";
import {
  buildTopic,
  buildTopicHints,
  loadEntity,
  parseLang,
  parseLangList,
  parseQid,
  searchCandidates,
} from "./utils/index.js";

const DEFAULT_QUERY_LANG = "en";

export const resolveTopic = async ({
  query,
  qid,
  langs,
  queryLang = DEFAULT_QUERY_LANG,
  cache = createKeyValueCache(),
  fetch,
}) => {
  if (!query && !qid) {
    throw new SkillError({
      message: "Nothing to resolve.",
      hint: 'Pass --query "<topic>" (or --qid Q123) and --langs pl,cs.',
    });
  }

  const targetLangs = parseLangList(langs);
  const counter = createRequestCounter();
  const candidates = qid
    ? []
    : await searchCandidates({
        query,
        queryLang: parseLang(queryLang),
        cache,
        counter,
        fetch,
      });
  const chosenQid = qid ? parseQid(qid) : candidates[0].qid;
  const entity = await loadEntity({
    qid: chosenQid,
    langs: targetLangs,
    cache,
    counter,
    fetch,
  });
  const topic = buildTopic({ entity, langs: targetLangs });
  const alternatives = candidates.filter(
    (candidate) => candidate.qid !== topic.qid,
  );
  const foundCount = topic.articles.filter(({ title }) => title).length;

  return {
    summary: `Topic ${topic.qid} "${topic.label}": articles in ${foundCount} of ${targetLangs.length} languages.`,
    data: { topic, alternatives },
    hints: buildTopicHints({ topic, alternatives }),
    networkRequests: counter.count(),
  };
};
