import { parseArgs } from "node:util";
import { EXIT_CODES } from "./constants/index.js";
import { SkillError } from "./skill-error.js";

const HELP_OPTION = { help: { type: "boolean", short: "h" } };

const readArgs = (options) => {
  try {
    return parseArgs({ options: { ...options, ...HELP_OPTION } }).values;
  } catch (error) {
    throw new SkillError({
      message: error.message,
      hint: "Run with --help to see the available options.",
    });
  }
};

export const parseCli = ({ options, usage }) => {
  const values = readArgs(options);

  if (values.help) {
    process.stdout.write(usage);
    process.exit(EXIT_CODES.SUCCESS);
  }

  return values;
};
