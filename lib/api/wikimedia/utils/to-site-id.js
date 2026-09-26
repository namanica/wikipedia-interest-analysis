const SITE_SUFFIX = "wiki";

export const toSiteId = (lang) => `${lang.replaceAll("-", "_")}${SITE_SUFFIX}`;
