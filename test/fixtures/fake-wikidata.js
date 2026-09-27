const SITE_SUFFIX = "wiki";

const toSitelinks = (sites, titles) =>
  Object.fromEntries(
    sites
      .map((site) => [site, titles[site.slice(0, -SITE_SUFFIX.length)]])
      .filter(([, title]) => title)
      .map(([site, title]) => [site, { site, title }]),
  );

const toClaims = (ids) => ({
  P279: ids.map((id) => ({ mainsnak: { datavalue: { value: { id } } } })),
});

export const createFakeWikidata = ({
  candidates,
  titles,
  parents = {},
  broader = {},
}) => ({
  respond: (url) => {
    const params = url.searchParams;

    if (params.get("action") === "wbsearchentities") {
      return {
        search: candidates.map(({ qid, label, description }) => ({
          id: qid,
          label,
          description,
        })),
      };
    }

    const ids = params.get("ids").split("|");

    if (params.get("props") === "claims") {
      return {
        entities: Object.fromEntries(
          ids.map((id) => [id, { id, claims: toClaims(parents[id] ?? []) }]),
        ),
      };
    }

    const sites = params.get("sitefilter").split("|");
    const main = {
      label: candidates[0].label,
      description: candidates[0].description,
      titles,
    };

    return {
      entities: Object.fromEntries(
        ids.map((id) => {
          const entity = broader[id] ?? main;

          return [
            id,
            {
              id,
              labels: { en: { value: entity.label } },
              descriptions: { en: { value: entity.description } },
              sitelinks: toSitelinks(sites, entity.titles),
            },
          ];
        }),
      ),
    };
  },
});
