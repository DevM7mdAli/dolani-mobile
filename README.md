# Dolani — Mobile (Expo)

A React Native (Expo SDK 54) mobile app scaffold for Dolani — an indoor navigation mobile client. This README explains how to run the project, developer workflows, and common troubleshooting steps so any developer (junior → senior) can get started quickly.

---

## Quick start (macOS)

Prerequisites

- Node 18+ (recommended)
- pnpm 10 (project uses pnpm)
- Xcode (for iOS simulator) and Android Studio (for Android emulator) — only if you need simulators
- Git

1. Install dependencies

```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install
```

2. Run the dev server

```bash
pnpm start
# or (clear Metro cache):
pnpm start -- --clear
```

3. Open on simulator / device

- iOS simulator: `pnpm ios` or `npx expo start` → press `i`
- Android emulator: `pnpm android` or `npx expo start` → press `a`
- Web: `pnpm web`

> Tip: If you need native modules not supported by Expo Go (e.g., `react-native-ble-plx`, `react-native-mmkv`), use a Development Client (expo-dev-client).

---

## Useful commands

- Install deps: `pnpm install`
- Start dev server: `pnpm start`
- Run iOS simulator: `pnpm ios`
- Run Android emulator: `pnpm android`
- Format code: `pnpm exec prettier --write .`
- Lint: `pnpm lint`
- Type-check: `pnpm exec tsc --noEmit`
- Run Prettier check: `pnpm exec prettier --check .`

---

## Project structure (high level)

- `app/` — Expo Router (file-based routes)
- `components/` — UI atoms and molecules (create as you go)
- `hooks/` — custom React hooks (e.g., `useBeaconScanner`)
- `lib/` — shared singletons (e.g., `query-client.ts`)
- `services/` — API clients (`api.ts`), storage adapters
- `store/` — Zustand stores (UI + domain state)
- `utils/` — pure utilities and helpers (i18n, math)

---

## Key integrations (what's already wired)

- Styling: NativeWind (Tailwind) — `global.css` contains Dolani brand tokens (use `bg-primary`, `text-secondary`, `border-destructive`)
- i18n: `i18next` + `react-i18next` with `en`/`ar` and RTL support in `utils/i18n.ts`
- Server state: `@tanstack/react-query` — `lib/query-client.ts` exports the shared client
- State: `zustand` (create stores under `store/`)
- Storage: `react-native-mmkv` (high-performance) and `expo-secure-store` for secrets
- API: `services/api.ts` — axios instance + auth token interceptor

---

## Environment & API base URL

- By default the app will fall back to `http://localhost:3000/api` for API calls.
- To change the API base URL during development, add an `extra.apiUrl` entry under the `expo` object in `app.json`:

```json
{
  "expo": {
    "extra": { "apiUrl": "https://api.yourdomain.com" }
  }
}
```

Then restart the Metro server.

---

## Localization (i18n)

- The app auto-detects device language via `expo-localization`.
- Translation resources live in `utils/i18n.ts`. Add new keys there and use `t('namespace.key')` from `react-i18next`.
- Arabic (`ar`) is configured with RTL support — `I18nManager` is toggled automatically on startup.

---

## Fonts & assets

To add custom fonts:

1. Put font files under `assets/fonts/`.
2. Register them in `app/_layout.tsx` using `useFonts` from `expo-font`.
3. The splash screen is gated until fonts load (see `SplashScreen.preventAutoHideAsync()` in the root layout).

---

## Linting & formatting (consistency rules)

- Formatting: Prettier (configured in `prettier.config.mjs`) with `prettier-plugin-tailwindcss` and import sort plugin
- Linting: ESLint (flat config). `pnpm lint` runs the project linter.
- Commit rules: Husky + `lint-staged` + `commitlint` (conventional commits required)

Recommended pre-commit (what CI enforces):

```bash
pnpm exec prettier --check .
pnpm lint
pnpm exec tsc --noEmit
```

---

## Editor setup (VS Code recommended settings)

Add the following to `.vscode/settings.json` to avoid conflicts between Prettier and the editor:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

If you see imports reordered on save, disable the editor's `organizeImports` action (the config above already does this).

---

## Troubleshooting (common issues)

- Prettier vs ESLint import-order conflict:
  - Run `pnpm exec prettier --write .` then `git add -A`.
  - Ensure VS Code uses Prettier as the default formatter (see settings above).
- Native module changes not reflected in Expo Go:
  - Rebuild a development client or use Expo dev client for native-only libs.
- Metro cache oddities:
  - `pnpm start -- --clear`
- Type errors / missing types:
  - `pnpm exec tsc --noEmit`

---

## Contribution & commit messages

- Follow Conventional Commits (enforced by `commitlint`)
- Example: `feat(navigation): add blue-dot position interpolation`
- PRs should include:
  1. What changed
  2. Why it changed
  3. How to test manually

---

## Where to look first (developer onboarding)

- Root layout & providers: `app/_layout.tsx`
- Global styles & tokens: `global.css`
- Query client: `lib/query-client.ts`
- API client: `services/api.ts`
- i18n: `utils/i18n.ts`

---

If anything is unclear or you'd like me to add CI config, E2E tests, or example screens, say which area to scaffold next and I'll add it.
