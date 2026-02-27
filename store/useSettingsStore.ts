import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { type StateStorage, createJSONStorage, persist } from 'zustand/middleware';

/* ── MMKV-backed storage adapter for Zustand ── */

const mmkv = createMMKV({ id: 'settings-store' });

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

/* ── State shape ── */

interface SettingsState {
  language: 'ar' | 'en';
  avoidElevators: boolean;
  avoidStairs: boolean;
  setLanguage: (lang: 'ar' | 'en') => void;
  setAvoidElevators: (value: boolean) => void;
  setAvoidStairs: (value: boolean) => void;
}

/* ── Store ── */

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ar',
      avoidElevators: false,
      avoidStairs: false,
      setLanguage: (language) => set({ language }),
      setAvoidElevators: (avoidElevators) => set({ avoidElevators }),
      setAvoidStairs: (avoidStairs) => set({ avoidStairs }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
