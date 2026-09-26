import { buildDailyPoints } from "./synthetic-series.js";

const DATE_RANGE = /\/daily\/(\d{8})\/(\d{8})$/;

const toIso = (compact) =>
  `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;

const toTimestamp = (isoDate) => `${isoDate.replaceAll("-", "")}00`;

const jsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers(),
  json: async () => data,
});

export const createFakeWikimedia = ({ article, total, entities = {} }) => {
  const calls = [];

  const fetch = async (url) => {
    calls.push(url);

    if (url.includes("wikidata.org")) {
      return jsonResponse(entities.respond(new URL(url)));
    }

    const [, start, end] = url.match(DATE_RANGE);
    const value = url.includes("/aggregate/") ? total : article;

    if (!value) {
      return jsonResponse({ type: "not found" }, 404);
    }

    const points = buildDailyPoints({
      start: toIso(start),
      end: toIso(end),
      value,
    });

    return jsonResponse({
      items: points.map(({ date, value: views }) => ({
        timestamp: toTimestamp(date),
        views,
      })),
    });
  };

  return { fetch, calls };
};
