import { SKILL_DIR } from "./constants/index.js";
import { SkillError } from "./skill-error.js";

const MODULE_NOT_FOUND = "ERR_MODULE_NOT_FOUND";

const printError = ({ message, hint }) => {
  const output = JSON.stringify({ ok: false, error: message, hint });

  process.stderr.write(`${output}\n`);
};

const toSkillError = (error) =>
  error.code === MODULE_NOT_FOUND
    ? new SkillError({
        message: "Chart and PDF dependencies are not installed.",
        hint: `Run "npm ci" once in ${SKILL_DIR}, then rerun the same command.`,
      })
    : error;

export const runScript = async (main) => {
  try {
    await main();
  } catch (caught) {
    const error = toSkillError(caught);

    if (!(error instanceof SkillError)) {
      throw error;
    }

    printError(error);
    process.exitCode = error.exitCode;
  }
};
