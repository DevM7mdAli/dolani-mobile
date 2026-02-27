/* ── Building / Floor / Department / Location types ── */

export interface Building {
  id: number;
  name: string;
  code: string;
  floors: FloorSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface FloorSummary {
  id: number;
  floor_number: number;
  floor_plan_image_url: string | null;
}

export interface Floor {
  id: number;
  floor_number: number;
  floor_plan_image_url: string | null;
  building_id: number;
  building: { id: number; name: string; code: string };
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  type: string;
}

export type LocationType =
  | 'CLASSROOM'
  | 'OFFICE'
  | 'CORRIDOR'
  | 'LAB'
  | 'THEATER'
  | 'CONFERENCE'
  | 'EXIT'
  | 'ELEVATOR'
  | 'MAIN_HALL'
  | 'RESTROOM'
  | 'STAIRS'
  | 'SERVICE'
  | 'PRAYER_ROOM'
  | 'SERVER_ROOM'
  | 'STORE_ROOM'
  | 'LOCKERS'
  | 'CAFETERIA'
  | 'WAITING_HALL'
  | 'ELECTRICAL_ROOM';

export interface Location {
  id: number;
  type: LocationType;
  name: string;
  room_number: string | null;
  near: string | null;
  capacity: number;
  equipment: string[];
  coordinate_x: number;
  coordinate_y: number;
  floor_id: number;
  department_id: number | null;
  floor: {
    id: number;
    floor_number: number;
    floor_plan_image_url: string | null;
    building_id: number;
    building: { id: number; name: string; code: string };
  };
  department: Department | null;
  beacons: { id: number; uuid: string; name: string | null }[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationDetail extends Location {
  outgoing_paths: {
    id: number;
    distance: number;
    end_location: { id: number; name: string; room_number: string | null; type: LocationType };
  }[];
  incoming_paths: {
    id: number;
    distance: number;
    start_location: { id: number; name: string; room_number: string | null; type: LocationType };
  }[];
}

/* ── Pagination ── */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/* ── Query params ── */

export interface LocationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  type?: LocationType;
  floorId?: number;
  buildingId?: number;
  departmentId?: number;
}
