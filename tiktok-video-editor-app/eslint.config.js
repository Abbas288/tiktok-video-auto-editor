const expo = require("eslint-config-expo/flat");
const prettier = require("eslint-plugin-prettier/recommended");

module.exports = [
  {
    ignores: ["expo-env.d.ts", ".expo/**", "node_modules/**"],
  },
  ...expo,
  prettier,
];
