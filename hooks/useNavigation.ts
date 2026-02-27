import { calculateRoute, getNavigableLocations } from '@/services/navigation';
import type { RouteRequest } from '@/types/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

/* ── Query key factory ── */

export const navigationKeys = {
  all: ['navigation'] as const,
  locations: () => [...navigationKeys.all, 'locations'] as const,
};

/* ── Hooks ── */

/** Fetch all navigable graph nodes (for location picker/map). */
export function useNavigableLocations() {
  return useQuery({
    queryKey: navigationKeys.locations(),
    queryFn: getNavigableLocations,
    staleTime: 5 * 60 * 1000,
  });
}

/** Calculate a route — used as a mutation (imperative trigger). */
export function useRoute() {
  return useMutation({
    mutationFn: (req: RouteRequest) => calculateRoute(req),
  });
}
