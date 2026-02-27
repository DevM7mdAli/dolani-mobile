/* ── Faculty / Professor types ── */

export type ProfessorStatus = 'AVAILABLE' | 'NOT_AVAILABLE';

export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface OfficeHours {
  id: number;
  professor_id: number;
  day: DayOfWeek;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface Professor {
  id: number;
  full_name: string;
  email: string;
  status: ProfessorStatus;
  phone_number: string | null;
  show_phone: boolean;
  user_id: number;
  location_id: number | null;
  department_id: number;
  office: {
    id: number;
    name: string;
    room_number: string | null;
    type: string;
    coordinate_x: number;
    coordinate_y: number;
    floor_id: number;
  } | null;
  department: {
    id: number;
    name: string;
    type: string;
  };
  office_hours: OfficeHours[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfessorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  departmentId?: number;
  status?: ProfessorStatus;
}
