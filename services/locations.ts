import type {
  Building,
  Department,
  Floor,
  Location,
  LocationDetail,
  LocationQueryParams,
  PaginatedResponse,
} from '@/types/location';

import { api } from './api';

/** GET /locations — paginated, filtered, searchable. */
export async function getLocations(
  params: LocationQueryParams = {},
): Promise<PaginatedResponse<Location>> {
  const { data } = await api.get<PaginatedResponse<Location>>('/locations', { params });
  return data;
}

/** GET /locations/:id — single location with full detail. */
export async function getLocationById(id: number): Promise<LocationDetail> {
  const { data } = await api.get<LocationDetail>(`/locations/${id}`);
  return data;
}

/** GET /locations/buildings — all buildings with nested floors. */
export async function getBuildings(): Promise<Building[]> {
  const { data } = await api.get<Building[]>('/locations/buildings');
  return data;
}

/** GET /locations/departments — all departments. */
export async function getDepartments(): Promise<Department[]> {
  const { data } = await api.get<Department[]>('/locations/departments');
  return data;
}

/** GET /locations/floors — floors with optional building filter. */
export async function getFloors(buildingId?: number): Promise<Floor[]> {
  const { data } = await api.get<Floor[]>('/locations/floors', {
    params: buildingId ? { buildingId } : undefined,
  });
  return data;
}
