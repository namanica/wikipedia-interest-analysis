import packageJson from "#package.json" with { type: "json" };

const { name, version, homepage } = packageJson;

export const USER_AGENT = `${name}/${version} (${homepage})`;
