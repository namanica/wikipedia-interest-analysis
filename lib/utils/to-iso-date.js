const ISO_DATE_LENGTH = 10;

export const toIsoDate = (date) => date.toISOString().slice(0, ISO_DATE_LENGTH);
