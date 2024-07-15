import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    "extends": "eslint:recommended",
    "rules": {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "strict": ["error", "global"],
      "eqeqeq": "warn",
      "no-implicit-globals": "error",
      "no-var": "error",
      "prefer-const": "warn"
    },
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module"
    },
    "env": {
      "browser": true,
      "node": true,
      "es6": true
    }
  },
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}, 'import/no-unresolved': ['error', {commonjs: true}]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];