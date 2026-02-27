import type { BeaconResolveResponse, RssiIngestResponse } from '@/types/beacon';

import { api } from './api';

/**
 * Ask the backend to resolve a beacon UUID to its metadata
 * (name, location, floor, department, etc.)
 *
 * Endpoint: POST /beacons/resolve  (public — no auth)
 */
export async function resolveBeacon(uuid: string): Promise<BeaconResolveResponse> {
  const { data } = await api.post<BeaconResolveResponse>('/beacons/resolve', {
    uuid,
  });
  return data;
}

/**
 * Submit a raw RSSI reading to the backend and receive the
 * server-side smoothed value.
 *
 * Endpoint: POST /beacons/rssi  (public — no auth)
 */
export async function submitRssi(beaconUuid: string, rssi: number): Promise<RssiIngestResponse> {
  const { data } = await api.post<RssiIngestResponse>('/beacons/rssi', {
    beaconUuid,
    rssi,
  });
  return data;
}
