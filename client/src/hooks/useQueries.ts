import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  Teacher, Subject, ClassGroup, Room, TimeSlot,
  TeacherAvailability, TeachingAssignment, ScheduleEntry, AcademicYear,
} from '../types';

// ---- Query Keys ----
export const qk = {
  teachers: (ayId: string) => ['teachers', ayId] as const,
  subjects: (ayId: string) => ['subjects', ayId] as const,
  classes: (ayId: string) => ['classes', ayId] as const,
  rooms: (ayId: string) => ['rooms', ayId] as const,
  timeSlots: (ayId: string) => ['timeSlots', ayId] as const,
  availabilities: (ayId: string) => ['availabilities', ayId] as const,
  assignments: (ayId: string) => ['assignments', ayId] as const,
  schedules: (ayId: string) => ['schedules', ayId] as const,
  settings: ['settings'] as const,
  academicYears: ['academicYears'] as const,
};

// ---- Generic CRUD hook ----
function useCrud<T extends { id: string }>(
  key: readonly unknown[],
  fetcher: () => Promise<T[]>,
  saver: (item: T) => Promise<T>,
  deleter: (id: string) => Promise<void>,
) {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: key,
    queryFn: fetcher,
  });

  const save = useMutation({
    mutationFn: saver,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: deleter,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const refetch = () => qc.invalidateQueries({ queryKey: key });

  return { data: list.data ?? [], isLoading: list.isLoading, save, remove, refetch };
}

// ---- Teachers ----
export function useTeachers(ayId: string | undefined) {
  return useCrud<Teacher>(
    qk.teachers(ayId ?? ''),
    () => api.getTeachers(ayId!),
    (t) => api.saveTeacher(t),
    (id) => api.deleteTeacher(id),
  );
}

// ---- Subjects ----
export function useSubjects(ayId: string | undefined) {
  return useCrud<Subject>(
    qk.subjects(ayId ?? ''),
    () => api.getSubjects(ayId!),
    (s) => api.saveSubject(s),
    (id) => api.deleteSubject(id),
  );
}

// ---- Classes ----
export function useClasses(ayId: string | undefined) {
  return useCrud<ClassGroup>(
    qk.classes(ayId ?? ''),
    () => api.getClasses(ayId!),
    (c) => api.saveClass(c),
    (id) => api.deleteClass(id),
  );
}

// ---- Rooms ----
export function useRooms(ayId: string | undefined) {
  return useCrud<Room>(
    qk.rooms(ayId ?? ''),
    () => api.getRooms(ayId!),
    (r) => api.saveRoom(r),
    (id) => api.deleteRoom(id),
  );
}

// ---- Time Slots ----
export function useTimeSlots(ayId: string | undefined) {
  const qc = useQueryClient();
  const key = qk.timeSlots(ayId ?? '');

  const list = useQuery({
    queryKey: key,
    queryFn: () => api.getTimeSlots(ayId!),
    enabled: !!ayId,
  });

  const saveOne = useMutation({
    mutationFn: (ts: TimeSlot) => api.saveTimeSlot(ts),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const saveAll = useMutation({
    mutationFn: ({ slots }: { slots: TimeSlot[] }) => api.saveAllTimeSlots(ayId!, slots),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { data: list.data ?? [], isLoading: list.isLoading, saveOne, saveAll };
}

// ---- Availabilities ----
export function useAvailabilities(ayId: string | undefined) {
  return useCrud<TeacherAvailability>(
    qk.availabilities(ayId ?? ''),
    () => api.getAvailabilities(ayId!),
    (a) => api.saveAvailability(a),
    (id) => api.deleteAvailability(id),
  );
}

// ---- Assignments ----
export function useAssignments(ayId: string | undefined) {
  return useCrud<TeachingAssignment>(
    qk.assignments(ayId ?? ''),
    () => api.getAssignments(ayId!),
    (a) => api.saveAssignment(a),
    (id) => api.deleteAssignment(id),
  );
}

// ---- Schedules ----
export function useSchedules(ayId: string | undefined) {
  const qc = useQueryClient();
  const key = qk.schedules(ayId ?? '');

  const list = useQuery({
    queryKey: key,
    queryFn: () => api.getSchedules(ayId!),
    enabled: !!ayId,
  });

  const save = useMutation({
    mutationFn: (s: ScheduleEntry) => api.saveSchedule(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const clear = useMutation({
    mutationFn: () => api.clearSchedules(ayId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const generate = useMutation({
    mutationFn: () => api.generateSchedule(ayId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    data: list.data ?? [],
    isLoading: list.isLoading,
    save, clear, generate,
  };
}

// ---- Settings ----
export function useSettings() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: qk.settings,
    queryFn: () => api.getSettings(),
  });

  const save = useMutation({
    mutationFn: (data: Record<string, string>) => api.saveSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.settings }),
  });

  return { data: query.data, isLoading: query.isLoading, save };
}

// ---- Academic Years ----
export function useAcademicYears() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: qk.academicYears,
    queryFn: () => api.getAcademicYears(),
  });

  const save = useMutation({
    mutationFn: (ay: AcademicYear) => api.saveAcademicYear(ay),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.academicYears }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteAcademicYear(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.academicYears }),
  });

  return { data: list.data ?? [], isLoading: list.isLoading, save, remove };
}
