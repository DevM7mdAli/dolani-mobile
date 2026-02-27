/**
 * Weighted Moving Average (WMA) filter for RSSI signal smoothing.
 * Recent readings receive higher weights — matches the backend's approach.
 *
 * @param values  Array of RSSI readings (oldest first, newest last)
 * @returns       Smoothed RSSI value
 */
export function weightedMovingAverage(values: number[]): number {
  if (values.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;

  for (let i = 0; i < values.length; i++) {
    const weight = i + 1; // 1, 2, 3, … (newest has highest weight)
    weightedSum += values[i]! * weight;
    weightTotal += weight;
  }

  return Math.round((weightedSum / weightTotal) * 100) / 100;
}

/**
 * Manages a sliding RSSI window per beacon UUID and returns the
 * smoothed value after each new reading.
 */
export class RssiSmoother {
  private windows = new Map<string, number[]>();
  private readonly windowSize: number;

  constructor(windowSize = 5) {
    this.windowSize = windowSize;
  }

  /** Push a new RSSI reading and return the smoothed value */
  push(uuid: string, rssi: number): number {
    let window = this.windows.get(uuid);
    if (!window) {
      window = [];
      this.windows.set(uuid, window);
    }

    window.push(rssi);
    if (window.length > this.windowSize) {
      window.shift();
    }

    return weightedMovingAverage(window);
  }

  /** Clear all windows (e.g., when scanning restarts after background) */
  clear(): void {
    this.windows.clear();
  }

  /** Get the current smoothed value for a beacon (or null if no data) */
  get(uuid: string): number | null {
    const window = this.windows.get(uuid);
    if (!window || window.length === 0) return null;
    return weightedMovingAverage(window);
  }
}
