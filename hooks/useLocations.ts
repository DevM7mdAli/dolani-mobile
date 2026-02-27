import {
  getBuildings,
  getDepartments,
  getFloors,
  getLocationById,
  getLocations,
} from '@/services/locations';
import type { LocationQueryParams } from '@/types/location';
import { useQuery } from '@tanstack/react-query';

/* ── Query key factory ── */

export const locationKeys = {
  all: ['locations'] as const,
  lists: () => [...locationKeys.all, 'list'] as const,
  list: (params: LocationQueryParams) => [...locationKeys.lists(), params] as const,
  details: () => [...locationKeys.all, 'detail'] as const,
  detail: (id: number) => [...locationKeys.details(), id] as const,
  buildings: () => [...locationKeys.all, 'buildings'] as const,
  departments: () => [...locationKeys.all, 'departments'] as const,
  floors: (buildingId?: number) => [...locationKeys.all, 'floors', buildingId] as const,
};

/* ── Hooks ── */

export function useLocations(params: LocationQueryParams = {}) {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => getLocations(params),
  });
}

export function useLocationDetail(id: number) {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => getLocationById(id),
    enabled: id > 0,
  });
}

export function useBuildings() {
  return useQuery({
    queryKey: locationKeys.buildings(),
    queryFn: getBuildings,
    staleTime: 5 * 60 * 1000, // buildings rarely change
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: locationKeys.departments(),
    queryFn: getDepartments,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFloors(buildingId?: number) {
  return useQuery({
    queryKey: locationKeys.floors(buildingId),
    queryFn: () => getFloors(buildingId),
    staleTime: 5 * 60 * 1000,
  });
}
