import { getFaculty, getFacultyById, searchFaculty } from '@/services/faculty';
import type { ProfessorQueryParams } from '@/types/faculty';
import { useQuery } from '@tanstack/react-query';

/* ── Query key factory ── */

export const facultyKeys = {
  all: ['faculty'] as const,
  lists: () => [...facultyKeys.all, 'list'] as const,
  list: (params: ProfessorQueryParams) => [...facultyKeys.lists(), params] as const,
  search: (q: string) => [...facultyKeys.all, 'search', q] as const,
  details: () => [...facultyKeys.all, 'detail'] as const,
  detail: (id: number) => [...facultyKeys.details(), id] as const,
};

/* ── Hooks ── */

export function useFaculty(params: ProfessorQueryParams = {}) {
  return useQuery({
    queryKey: facultyKeys.list(params),
    queryFn: () => getFaculty(params),
  });
}

export function useFacultySearch(q: string) {
  return useQuery({
    queryKey: facultyKeys.search(q),
    queryFn: () => searchFaculty(q),
    enabled: q.trim().length >= 2,
  });
}

export function useFacultyDetail(id: number) {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: () => getFacultyById(id),
    enabled: id > 0,
  });
}
