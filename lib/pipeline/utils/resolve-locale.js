import { REPORT_TEXT } from "#lib/report/index.js";

const DEFAULT_LOCALE = "en";

export const resolveLocale = (locale = DEFAULT_LOCALE) => {
  const key = locale.trim().toUpperCase();
  const isSupported = key in REPORT_TEXT;

  return {
    locale: isSupported ? locale.trim().toLowerCase() : DEFAULT_LOCALE,
    key: isSupported ? key : DEFAULT_LOCALE.toUpperCase(),
    isSupported,
  };
};
