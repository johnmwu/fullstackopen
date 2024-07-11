import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}, 'import/no-unresolved': ['error', {commonjs: true}]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];