/** @type {import("prettier").Config} */
export default {
  // 1. Core Formatting
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,

  // 2. Import Sorting (Group by: React/Expo -> Internal -> Relative)
  importOrder: [
    '^(react|react-native|expo|expo-router)$', // React Core
    '<THIRD_PARTY_MODULES>', // npm packages
    '^@/components/(.*)$', // UI Components
    '^@/hooks/(.*)$', // Custom Hooks
    '^@/utils/(.*)$', // Utilities
    '^[./]', // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // 3. Plugins (Order matters: Tailwind must be last)
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
};