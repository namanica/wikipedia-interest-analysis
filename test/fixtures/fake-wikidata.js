const SITE_SUFFIX = "wiki";

export const createFakeWikidata = ({ candidates, titles }) => ({
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

    const qid = params.get("ids");
    const sites = params.get("sitefilter").split("|");
    const sitelinks = Object.fromEntries(
      sites
        .map((site) => [site, titles[site.slice(0, -SITE_SUFFIX.length)]])
        .filter(([, title]) => title)
        .map(([site, title]) => [site, { site, title }]),
    );

    return {
      entities: {
        [qid]: {
          id: qid,
          labels: { en: { value: candidates[0].label } },
          descriptions: { en: { value: candidates[0].description } },
          sitelinks,
        },
      },
    };
  },
});
