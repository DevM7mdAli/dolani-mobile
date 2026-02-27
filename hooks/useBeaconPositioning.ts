import { useCallback, useEffect, useRef } from 'react';

import { resolveBeacon } from '@/services/beacons';
import { useNavigationStore } from '@/store/useNavigationStore';
import type { BeaconResolveResponse } from '@/types/beacon';

import { type BeaconReading, useBeaconScanner } from './useBeaconScanner';

/* ── Configuration ── */

/** Minimum interval between resolve API calls (ms). */
const RESOLVE_COOLDOWN_MS = 3_000;

/** Don't attempt resolve if strongest beacon is farther than this (metres). */
const MAX_RESOLVE_DISTANCE = 15;

/* ── Return type ── */

export interface UseBeaconPositioningReturn {
  /** Current BLE scanner status. */
  scannerStatus: ReturnType<typeof useBeaconScanner>['status'];
  /** All visible beacons (sorted strongest-first). */
  beacons: BeaconReading[];
  /** The strongest beacon in range (if any). */
  strongest: BeaconReading | null;
  /** Most recently resolved location from the backend. */
  resolvedLocation: BeaconResolveResponse['location'] | null;
  /** Any BLE error string. */
  error: string | null;
  /** Manually start scanning. */
  start: () => void;
  /** Manually stop scanning. */
  stop: () => void;
}

/**
 * High-level hook that combines the BLE scanner with the backend
 * resolve endpoint to keep `useNavigationStore.currentLocationId`
 * up-to-date automatically.
 *
 * Usage: call once in the root layout so positioning runs app-wide.
 */
export function useBeaconPositioning(autoStart = true): UseBeaconPositioningReturn {
  const { status, beacons, strongest, start, stop, error } = useBeaconScanner(autoStart);

  const setCurrentLocation = useNavigationStore((s) => s.setCurrentLocation);

  const lastResolvedUuid = useRef<string | null>(null);
  const lastResolveTime = useRef(0);
  const resolvedLocationRef = useRef<BeaconResolveResponse['location'] | null>(null);

  const resolveStrongest = useCallback(
    async (beacon: BeaconReading) => {
      const now = Date.now();

      // Skip if same beacon was resolved recently
      if (
        beacon.uuid === lastResolvedUuid.current &&
        now - lastResolveTime.current < RESOLVE_COOLDOWN_MS
      ) {
        return;
      }

      // Skip beacons that are too far away
      if (beacon.distance > MAX_RESOLVE_DISTANCE) return;

      lastResolvedUuid.current = beacon.uuid;
      lastResolveTime.current = now;

      try {
        const res = await resolveBeacon(beacon.uuid);
        if (res.operating && res.location) {
          resolvedLocationRef.current = res.location;
          setCurrentLocation(res.location.id);
        }
      } catch {
        // Silently ignore — keep previous location
        console.warn('[Positioning] resolve failed for', beacon.uuid);
      }
    },
    [setCurrentLocation],
  );

  /* Auto-resolve whenever the strongest beacon changes */
  useEffect(() => {
    if (strongest) {
      resolveStrongest(strongest);
    }
  }, [strongest?.uuid, strongest?.distance, resolveStrongest]);

  return {
    scannerStatus: status,
    beacons,
    strongest,
    resolvedLocation: resolvedLocationRef.current,
    error,
    start,
    stop,
  };
}
