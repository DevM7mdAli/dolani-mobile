/* ── Navigation / Pathfinding types ── */
import type { LocationType } from './location';

export interface GraphNode {
  id: number;
  type: LocationType;
  name: string;
  roomNumber: string | null;
  x: number;
  y: number;
  floorId: number;
}

export interface PathResult {
  totalDistance: number;
  nodes: GraphNode[];
}

export interface RouteRequest {
  startLocationId: number;
  endLocationId: number;
  emergency?: boolean;
  avoidStairs?: boolean;
}
