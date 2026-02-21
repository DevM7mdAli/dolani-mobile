const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = defineConfig([
  // 1. Base Configuration (Official Expo)
  ...expoConfig,

  // 2. Prettier Configuration (Disables conflicting ESLint rules)
  prettierConfig,

  // 3. Custom "Senior Developer" Rules
  {
    plugins: {
      prettier: prettierPlugin,
      'react-native': reactNativePlugin,
    },
    // Apply these rules to source files
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Run Prettier as an ESLint rule (fixes formatting errors automatically)
      'prettier/prettier': 'error',

      // Senior Mobile Rules (Performance & Cleanliness)
      'react-native/no-unused-styles': 'error', // Remove dead styles
      'react-native/no-color-literals': 'warn', // Enforce theme usage

      // General Code Quality
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Clean up debug logs
      'react/react-in-jsx-scope': 'off', // Not needed in Expo
    },
  },

  {
    ignores: ['dist/*', '.expo/*', 'web-build/*'],
  },
]);
