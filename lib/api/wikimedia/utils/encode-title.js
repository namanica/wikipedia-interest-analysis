export const encodeTitle = (title) =>
  encodeURIComponent(title.trim().replaceAll(" ", "_"));
