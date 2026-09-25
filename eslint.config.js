import js from "@eslint/js";
import importPlugin from "eslint-plugin-import-x";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    plugins: { import: importPlugin },
    rules: {
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "no-magic-numbers": ["error", { ignoreArrayIndexes: true }],
      "import/no-cycle": "error",
    },
  },
];
