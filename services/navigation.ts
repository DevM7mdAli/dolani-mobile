import type { GraphNode, PathResult, RouteRequest } from '@/types/navigation';

import { api } from './api';

/** POST /navigation/route — A* pathfinding between two locations. */
export async function calculateRoute(req: RouteRequest): Promise<PathResult> {
  const { data } = await api.post<PathResult>('/navigation/route', req);
  return data;
}

/** GET /navigation/locations — all navigable graph nodes. */
export async function getNavigableLocations(): Promise<GraphNode[]> {
  const { data } = await api.get<GraphNode[]>('/navigation/locations');
  return data;
}
