const TIMESTAMP_LENGTH = 19;
const MAX_SLUG_LENGTH = 40;

export const buildRunId = ({ label, now }) => {
  const timestamp = now
    .toISOString()
    .slice(0, TIMESTAMP_LENGTH)
    .replaceAll(":", "")
    .replace("T", "-")
    .replaceAll("-", "");
  const slug = (label ?? "topic")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_SLUG_LENGTH);

  return `${timestamp}-${slug || "topic"}`;
};
