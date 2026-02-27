/**
 * Convert an RSSI reading to an estimated distance (metres) using
 * the **Log-Distance Path Loss Model**.
 *
 *   distance = 10 ^ ((txPower − rssi) / (10 × n))
 *
 * @param rssi     Received signal strength (dBm, negative)
 * @param txPower  Calibrated TX power at 1 m (default: −59 dBm)
 * @param n        Path-loss exponent (2.0 = free space, 2.5–3.0 = indoor)
 * @returns        Estimated distance in metres (clamped ≥ 0.1)
 */
export function rssiToDistance(rssi: number, txPower = -59, n = 2.5): number {
  if (rssi >= 0) return 0.1; // invalid reading — treat as very close

  const distance = Math.pow(10, (txPower - rssi) / (10 * n));
  return Math.max(0.1, Math.round(distance * 100) / 100);
}
