import type { Professor, ProfessorQueryParams } from '@/types/faculty';
import type { PaginatedResponse } from '@/types/location';

import { api } from './api';

/** GET /faculty — paginated list with optional filters. */
export async function getFaculty(
  params: ProfessorQueryParams = {},
): Promise<PaginatedResponse<Professor>> {
  const { data } = await api.get<PaginatedResponse<Professor>>('/faculty', { params });
  return data;
}

/** GET /faculty/search?q= — search professors by name. */
export async function searchFaculty(q: string): Promise<Professor[]> {
  const { data } = await api.get<Professor[]>('/faculty/search', { params: { q } });
  return data;
}

/** GET /faculty/:id — single professor detail. */
export async function getFacultyById(id: number): Promise<Professor> {
  const { data } = await api.get<Professor>(`/faculty/${id}`);
  return data;
}
