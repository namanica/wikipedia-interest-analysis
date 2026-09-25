import { EXIT_CODES } from "./constants/index.js";

export class SkillError extends Error {
  constructor({ message, hint, exitCode = EXIT_CODES.USER_ERROR }) {
    super(message);
    this.hint = hint;
    this.exitCode = exitCode;
  }
}
