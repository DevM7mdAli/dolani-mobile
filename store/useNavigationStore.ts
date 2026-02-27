import type { PathResult } from '@/types/navigation';
import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { type StateStorage, createJSONStorage, persist } from 'zustand/middleware';

/* ── MMKV-backed storage adapter for Zustand ── */

const mmkv = createMMKV({ id: 'navigation-store' });

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

/* ── Recent history item ── */

export interface RecentNavigation {
  locationId: number;
  name: string;
  roomNumber: string | null;
  buildingName: string;
  floorNumber: number;
  timestamp: number; // Date.now()
}

/* ── State shape ── */

interface NavigationState {
  /* Live navigation */
  currentLocationId: number | null;
  destinationId: number | null;
  isNavigating: boolean;
  isEmergency: boolean;
  routeResult: PathResult | null;

  /* Recent history (persisted) */
  recentNavigations: RecentNavigation[];

  /* Actions */
  setCurrentLocation: (id: number | null) => void;
  setDestination: (id: number | null) => void;
  setRoute: (result: PathResult | null) => void;
  startNavigation: (destinationId: number, emergency?: boolean) => void;
  stopNavigation: () => void;
  addRecentNavigation: (entry: RecentNavigation) => void;
  clearRecent: () => void;
}

const MAX_RECENT = 10;

/* ── Store ── */

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentLocationId: null,
      destinationId: null,
      isNavigating: false,
      isEmergency: false,
      routeResult: null,
      recentNavigations: [],

      setCurrentLocation: (currentLocationId) => set({ currentLocationId }),
      setDestination: (destinationId) => set({ destinationId }),
      setRoute: (routeResult) => set({ routeResult }),

      startNavigation: (destinationId, emergency = false) =>
        set({ destinationId, isNavigating: true, isEmergency: emergency, routeResult: null }),

      stopNavigation: () =>
        set({ isNavigating: false, isEmergency: false, routeResult: null, destinationId: null }),

      addRecentNavigation: (entry) =>
        set((state) => ({
          recentNavigations: [
            entry,
            ...state.recentNavigations.filter((r) => r.locationId !== entry.locationId),
          ].slice(0, MAX_RECENT),
        })),

      clearRecent: () => set({ recentNavigations: [] }),
    }),
    {
      name: 'navigation',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        recentNavigations: state.recentNavigations,
      }),
    },
  ),
);
