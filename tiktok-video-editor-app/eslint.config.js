const expo = require("eslint-config-expo/flat");
const prettier = require("eslint-plugin-prettier/recommended");

module.exports = [
  {
    ignores: [
      "expo-env.d.ts",
      ".expo/**",
      "node_modules/**",
      "dist/**",
      "web-build/**",
      "coverage/**",
      ".git/**",
      "ios/**",
      "android/**",
      "*.tsbuildinfo",
    ],
  },
  ...expo,
  prettier,
];
