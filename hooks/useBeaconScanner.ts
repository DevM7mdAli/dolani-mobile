import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import type { ScannerStatus } from '@/types/beacon';
import { BleManager, type Device, ScanMode, State, type Subscription } from 'react-native-ble-plx';

import { rssiToDistance } from '@/utils/distance-model';
import { RssiSmoother } from '@/utils/signal-processing';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BeaconReading {
  uuid: string;
  rawRssi: number;
  smoothedRssi: number;
  distance: number; // metres (estimated)
  lastSeen: number; // Date.now()
}

export interface UseBeaconScannerReturn {
  status: ScannerStatus;
  beacons: BeaconReading[];
  strongest: BeaconReading | null;
  start: () => void;
  stop: () => void;
  error: string | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Beacons older than this are evicted from the list (ms). */
const STALE_TIMEOUT_MS = 5_000;

/** Minimum interval between React state updates (ms) — ~2 fps. */
const THROTTLE_MS = 500;

/* ------------------------------------------------------------------ */
/*  Singleton BleManager                                               */
/* ------------------------------------------------------------------ */

let managerInstance: BleManager | null = null;

function getManager(): BleManager {
  if (!managerInstance) {
    managerInstance = new BleManager();
  }
  return managerInstance;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * BLE beacon scanner with AppState lifecycle management.
 *
 * - **Pause**: scanning stops when the app goes to background / inactive.
 * - **Resume**: scanning restarts when the app comes back to foreground.
 * - **BT-off**: detected automatically; scanning restarts when BT turns on.
 * - **Stale eviction**: beacons not seen for 5 s are removed.
 * - **Throttled UI**: React state is updated at most every 500 ms.
 */
export function useBeaconScanner(autoStart = true): UseBeaconScannerReturn {
  /* — React state (throttled) ——————————————————————————— */
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [beacons, setBeacons] = useState<BeaconReading[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* — Mutable refs (hot path — no re-renders) —————————— */
  const beaconMapRef = useRef(new Map<string, BeaconReading>());
  const smootherRef = useRef(new RssiSmoother(5));
  const statusRef = useRef<ScannerStatus>('idle');
  const throttleRef = useRef(0); // last flush timestamp
  const wantScanningRef = useRef(false); // user intent
  const btStateSubRef = useRef<Subscription | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  /* ————————————————————————————————————————————————————— */
  /*  Flush beacon map → React state (throttled)           */
  /* ————————————————————————————————————————————————————— */
  const flush = useCallback(() => {
    const now = Date.now();
    if (now - throttleRef.current < THROTTLE_MS) return;
    throttleRef.current = now;

    // Evict stale beacons
    for (const [uuid, reading] of beaconMapRef.current) {
      if (now - reading.lastSeen > STALE_TIMEOUT_MS) {
        beaconMapRef.current.delete(uuid);
      }
    }

    const list = Array.from(beaconMapRef.current.values()).sort(
      (a, b) => b.smoothedRssi - a.smoothedRssi, // strongest first
    );

    setBeacons(list);
  }, []);

  /* ————————————————————————————————————————————————————— */
  /*  Core scan lifecycle                                   */
  /* ————————————————————————————————————————————————————— */

  const startScanning = useCallback(async () => {
    const manager = getManager();
    setError(null);

    try {
      const btState = await manager.state();

      if (btState !== State.PoweredOn) {
        statusRef.current = 'bt-off';
        setStatus('bt-off');
        setError(
          btState === State.Unauthorized
            ? 'Bluetooth permission denied'
            : 'Bluetooth is turned off',
        );

        // Auto-resume when BT turns on
        btStateSubRef.current?.remove();
        btStateSubRef.current = manager.onStateChange((newState) => {
          if (newState === State.PoweredOn && wantScanningRef.current) {
            btStateSubRef.current?.remove();
            btStateSubRef.current = null;
            startScanning();
          }
        }, true);

        return;
      }

      // Clear stale data from the previous session
      beaconMapRef.current.clear();
      smootherRef.current.clear();

      await manager.startDeviceScan(
        null, // all service UUIDs
        {
          allowDuplicates: true,
          ...(Platform.OS === 'android' && {
            scanMode: ScanMode.LowLatency,
          }),
        },
        (scanError: Error | null, device: Device | null) => {
          if (scanError) {
            console.warn('[BLE] scan error', scanError.message);
            return;
          }
          if (!device || device.rssi == null) return;

          const uuid = device.serviceUUIDs?.[0] ?? device.localName ?? device.id;

          const smoothed = smootherRef.current.push(uuid, device.rssi);
          const distance = rssiToDistance(smoothed);

          beaconMapRef.current.set(uuid, {
            uuid,
            rawRssi: device.rssi,
            smoothedRssi: smoothed,
            distance,
            lastSeen: Date.now(),
          });

          flush();
        },
      );

      statusRef.current = 'scanning';
      setStatus('scanning');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown BLE error';
      console.error('[BLE] startScanning failed', msg);
      statusRef.current = 'error';
      setStatus('error');
      setError(msg);
    }
  }, [flush]);

  const stopScanning = useCallback(async () => {
    try {
      const manager = getManager();
      await manager.stopDeviceScan();
    } catch {
      // swallow — manager may not have been scanning
    }
  }, []);

  /* ————————————————————————————————————————————————————— */
  /*  Public start / stop (honour user intent)             */
  /* ————————————————————————————————————————————————————— */

  const start = useCallback(() => {
    wantScanningRef.current = true;
    startScanning();
  }, [startScanning]);

  const stop = useCallback(() => {
    wantScanningRef.current = false;
    stopScanning();
    statusRef.current = 'idle';
    setStatus('idle');
  }, [stopScanning]);

  /* ————————————————————————————————————————————————————— */
  /*  AppState lifecycle (pause / resume)                   */
  /* ————————————————————————————————————————————————————— */

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        const prev = appStateRef.current;
        appStateRef.current = nextAppState;

        // Active → background / inactive  ⟹  PAUSE
        if (prev === 'active' && (nextAppState === 'background' || nextAppState === 'inactive')) {
          if (statusRef.current === 'scanning') {
            await stopScanning();
            statusRef.current = 'paused';
            setStatus('paused');
          }
          return;
        }

        // Background / inactive → active  ⟹  RESUME
        if (nextAppState === 'active' && (prev === 'background' || prev === 'inactive')) {
          if (wantScanningRef.current && statusRef.current === 'paused') {
            startScanning();
          }
        }
      },
    );

    return () => subscription.remove();
  }, [startScanning, stopScanning]);

  /* ————————————————————————————————————————————————————— */
  /*  Auto-start on mount & cleanup on unmount              */
  /* ————————————————————————————————————————————————————— */

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      wantScanningRef.current = false;
      stopScanning();
      btStateSubRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ————————————————————————————————————————————————————— */
  /*  Derived: strongest beacon                             */
  /* ————————————————————————————————————————————————————— */

  const strongest = beacons.length > 0 ? beacons[0]! : null;

  return { status, beacons, strongest, start, stop, error };
}
