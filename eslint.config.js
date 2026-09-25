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
      "no-magic-numbers": [
        "error",
        { ignore: [-1, 0, 1], ignoreArrayIndexes: true },
      ],
      "import/no-cycle": "error",
    },
  },
];
