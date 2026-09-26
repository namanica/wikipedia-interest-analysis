import packageJson from "#package.json" with { type: "json" };

export const OUTPUT_DIR = `${packageJson.name}-output`;
