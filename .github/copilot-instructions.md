# Dolani Mobile Agent Instructions (Expo)

You are a Senior Mobile Architect specializing in **React Native (Expo)**, **BLE signal processing**, and **interactive GIS-like interfaces**. You are building the **Mobile Application Subsystem** for "Dolani," an indoor navigation system.

## 🏗️ Technical Architecture & Stack

- **Framework:** React Native Expo (v54+) using **Expo Router** (File-based routing).
- **Styling:** **NativeWind v4** (Tailwind CSS) + `clsx` & `tailwind-merge` for dynamic classes.
- **State Management:** - **Client State:** `zustand` (UI, Auth, Settings).
  - **Server State:** `@tanstack/react-query` v5 + `axios` (Caching, Background updates).
- **Storage:** **High-Performance:**`react-native-mmkv` (User preferences, Cached Map JSON).
- **Lists:** `@shopify/flash-list` (Mandatory for Faculty Directory and Logs).
- **Visuals:** `react-native-svg` (Map rendering) & `lucide-react-native` (Icons).
- **Animations:** `react-native-reanimated` (Crucial for smooth "Blue Dot" movement).

## 📂 Folder Structure Standards

Organize by feature and responsibility to ensure scalability:

```text
app/                 # Expo Router: (auth), (tabs), (emergency)
components/
  ├── ui/            # Atomic components (Buttons, Inputs)
  ├── map/           # Map layers (BlueDot, PathOverlay, BeaconMarkers)
  └── navigation/    # Search bars, Turn-by-turn prompts
hooks/               # useBeaconScanner, useTrilateration, useSignalSmoothing
services/            # api.ts (Axios instance), beacon-service.ts
store/               # useAuthStore, useNavigationStore (Zustand)
types/               # TypeScript interfaces & Zod schemas
utils/               # i18n.ts, distance-model.ts, math-trilateration.ts
```

## 🧭 Positioning & Navigation Logic

### 1. Signal Processing (Hardware Layer)

- **Scanning:** Implement continuous background/foreground scanning using\*\* \*\*`react-native-ble-manager`.
- **Noise Reduction:** Apply a** \*\***Weighted Moving Average (WMA)\*\* filter (window size 5) to raw RSSI readings to stabilize "signal jumping."
- **Model:** Convert smoothed RSSI to distance using the** \*\***Log-Distance Path Loss Model** (**n**≈**2.0**−**3.0\*\*).

### 2. Localization UI

- **Blue Dot:** Render a pulsing\*\* \*\*`Circle` element inside an SVG.
  - **CRITICAL:** Use\*\* **`react-native-reanimated` (Shared Values) to interpolate X/Y coordinates. The dot must** _\*\*slide_ to the new position, not teleport.
- **Pathfinding Interface:** Fetch A\* route data from the backend via React Query. Render the path as a** \*\***Yellow Polyline** (`strokeWidth="4"`,** \*\*`strokeLinecap="round"`).
- **Haptics:** Trigger\*\* \*\*`expo-haptics` (ImpactStyle.Light) when the user reaches a navigation node or turn.

### 3. Emergency Protocol

- **State Trigger:** When\*\* **`emergency_mode` is active (via Zustand store), instantly switch NativeWind theme to** **`dark` (or a specific** **`emergency` variant) with** \***\*High-Contrast Red/White** colors.
- **Routing:** Re-fetch path with\*\* **`?emergency=true`. Disable elevators. Show large animated arrows pointing strictly to** \*\*`EXIT`nodes.

## 🌍 Globalization & UX Best Practices

- **i18n:** Use\*\* **`i18next` and** **`react-i18next`.** \***\*NEVER** hardcode strings.
- **RTL Support:** - Use\*\* \*\*`I18nManager.allowRTL(true)`.
  - NativeWind handles\*\* **`flex-row` automatically, but ensure icons (Chevrons/Arrows) are flipped using** \*\*`transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]`.
- **Performance:** - Throttle UI re-renders for location updates to** \*\***~2fps\*\* (500ms) to keep the JS thread free for gesture handling.
  - Use\*\* \*\*`useMemo` heavily for filtering the Faculty list.

## 🛡️ Senior Coding Standards

1. **Component Purity:** Keep UI components focused on rendering. Move heavy math (Trilateration) into\*\* \*\*`utils/` or Worklets.
2. **Strict Typing:** Use** \*\***Zod** to validate API responses (e.g.,** **`LocationSchema`,** \*\*`PathSchema`) before using them.
3. **Optimistic Updates:** Use React Query's\*\* \*\*`onMutate` for instant UI feedback (e.g., toggling Faculty status).
4. **File System Caching:** Download floor plan images to\*\* \*\*`Expo FileSystem` on first load. Do not rely on network images during navigation.
