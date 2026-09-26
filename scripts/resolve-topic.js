import { runScript, parseCli, printResult } from "#lib/utils/index.js";
import { resolveTopic } from "#lib/pipeline/index.js";

const USAGE = `Find the Wikipedia articles about a topic in the given language editions (via Wikidata).

Usage:
  node scripts/resolve-topic.js --query "intermittent fasting" --langs pl,cs [options]

Options:
  --query <text>         topic name; English works best
  --query-lang <code>    language of --query, default: en (e.g. uk for "астрономія")
  --qid <Q…>             use this Wikidata item instead of searching (from alternatives)
  --langs <a,b,…>        Wikipedia language codes to look up, comma-separated
  -h, --help             show this help
`;

const OPTIONS = {
  query: { type: "string" },
  "query-lang": { type: "string" },
  qid: { type: "string" },
  langs: { type: "string" },
};

runScript(async () => {
  const values = parseCli({ options: OPTIONS, usage: USAGE });
  const result = await resolveTopic({
    query: values.query,
    queryLang: values["query-lang"],
    qid: values.qid,
    langs: values.langs,
  });

  printResult(result);
});
