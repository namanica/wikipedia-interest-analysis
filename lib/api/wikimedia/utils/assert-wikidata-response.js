import { SkillError, EXIT_CODES } from "#lib/utils/index.js";

export const assertWikidataResponse = (response) => {
  if (response?.error) {
    throw new SkillError({
      message: `Wikidata API error (${response.error.code}): ${response.error.info}`,
      hint: "Check the query and the language codes, then try again.",
      exitCode: EXIT_CODES.NETWORK_ERROR,
    });
  }
};
