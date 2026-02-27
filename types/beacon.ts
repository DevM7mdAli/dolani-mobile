/** Raw device discovered by BLE scanning */
export interface ScannedBeacon {
  uuid: string;
  rssi: number;
  timestamp: number;
}

/** Backend response from POST /beacons/resolve */
export interface BeaconResolveResponse {
  beaconId: number;
  beaconName: string | null;
  operating: boolean;
  location: {
    id: number;
    type: string;
    name: string;
    room_number: string | null;
    coordinate_x: number;
    coordinate_y: number;
    floor_id: number;
    floor: {
      id: number;
      floor_number: number;
      floor_plan_image_url: string | null;
      building_id: number;
    };
    department: {
      id: number;
      name: string;
      type: string;
    } | null;
  };
}

/** Backend response from POST /beacons/rssi */
export interface RssiIngestResponse {
  beaconId: number;
  rawRssi: number;
  smoothedRssi: number;
  windowSize: number;
}

/** Scanner status for the hook consumer */
export type ScannerStatus = 'idle' | 'scanning' | 'paused' | 'error' | 'bt-off';
