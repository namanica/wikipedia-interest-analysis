import { SkillError } from "./skill-error.js";

const printError = ({ message, hint }) => {
  const output = JSON.stringify({ ok: false, error: message, hint });

  process.stderr.write(`${output}\n`);
};

export const runScript = async (main) => {
  try {
    await main();
  } catch (error) {
    if (!(error instanceof SkillError)) {
      throw error;
    }

    printError(error);
    process.exitCode = error.exitCode;
  }
};
