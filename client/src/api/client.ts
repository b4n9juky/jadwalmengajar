import type {
  Teacher, Subject, ClassGroup, Room, TimeSlot,
  TeacherAvailability, TeachingAssignment, ScheduleEntry,
  AcademicYear,
} from '../types';

const BASE = '/api';

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return req('/teachers');
  },
  async saveTeacher(t: Teacher): Promise<Teacher> {
    const method = t.id && await fetch(`${BASE}/teachers/${t.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/teachers/${t.id}`, { method: 'PUT', body: JSON.stringify(t) })
      : req('/teachers', { method: 'POST', body: JSON.stringify(t) });
  },
  async deleteTeacher(id: string): Promise<void> {
    await req(`/teachers/${id}`, { method: 'DELETE' });
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return req('/subjects');
  },
  async saveSubject(s: Subject): Promise<Subject> {
    const method = s.id && await fetch(`${BASE}/subjects/${s.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/subjects/${s.id}`, { method: 'PUT', body: JSON.stringify(s) })
      : req('/subjects', { method: 'POST', body: JSON.stringify(s) });
  },
  async deleteSubject(id: string): Promise<void> {
    await req(`/subjects/${id}`, { method: 'DELETE' });
  },

  // Classes
  async getClasses(): Promise<ClassGroup[]> {
    return req('/classes');
  },
  async saveClass(c: ClassGroup): Promise<ClassGroup> {
    const method = c.id && await fetch(`${BASE}/classes/${c.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/classes/${c.id}`, { method: 'PUT', body: JSON.stringify(c) })
      : req('/classes', { method: 'POST', body: JSON.stringify(c) });
  },
  async deleteClass(id: string): Promise<void> {
    await req(`/classes/${id}`, { method: 'DELETE' });
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    return req('/rooms');
  },
  async saveRoom(r: Room): Promise<Room> {
    const method = r.id && await fetch(`${BASE}/rooms/${r.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/rooms/${r.id}`, { method: 'PUT', body: JSON.stringify(r) })
      : req('/rooms', { method: 'POST', body: JSON.stringify(r) });
  },
  async deleteRoom(id: string): Promise<void> {
    await req(`/rooms/${id}`, { method: 'DELETE' });
  },

  // Time Slots
  async getTimeSlots(): Promise<TimeSlot[]> {
    return req('/time-slots');
  },
  async saveTimeSlot(ts: TimeSlot): Promise<TimeSlot> {
    const exists = ts.id && await fetch(`${BASE}/time-slots/${ts.id}`, { method: 'HEAD' }).then(r => r.ok);
    if (exists) {
      return req(`/time-slots/${ts.id}`, { method: 'PUT', body: JSON.stringify(ts) });
    }
    return req('/time-slots', { method: 'POST', body: JSON.stringify(ts) });
  },
  async saveAllTimeSlots(slots: TimeSlot[]): Promise<TimeSlot[]> {
    return req('/time-slots', { method: 'PUT', body: JSON.stringify(slots) });
  },

  // Availabilities
  async getAvailabilities(): Promise<TeacherAvailability[]> {
    return req('/availabilities');
  },
  async saveAvailability(a: TeacherAvailability): Promise<TeacherAvailability> {
    const method = a.id && await fetch(`${BASE}/availabilities/${a.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/availabilities/${a.id}`, { method: 'PUT', body: JSON.stringify(a) })
      : req('/availabilities', { method: 'POST', body: JSON.stringify(a) });
  },
  async deleteAvailability(id: string): Promise<void> {
    await req(`/availabilities/${id}`, { method: 'DELETE' });
  },

  // Assignments
  async getAssignments(): Promise<TeachingAssignment[]> {
    return req('/assignments');
  },
  async saveAssignment(a: TeachingAssignment): Promise<TeachingAssignment> {
    const method = a.id && await fetch(`${BASE}/assignments/${a.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/assignments/${a.id}`, { method: 'PUT', body: JSON.stringify(a) })
      : req('/assignments', { method: 'POST', body: JSON.stringify(a) });
  },
  async deleteAssignment(id: string): Promise<void> {
    await req(`/assignments/${id}`, { method: 'DELETE' });
  },

  // Schedules
  async getSchedules(): Promise<ScheduleEntry[]> {
    return req('/schedules');
  },
  async saveSchedule(s: ScheduleEntry): Promise<ScheduleEntry> {
    const method = s.id && await fetch(`${BASE}/schedules/${s.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/schedules/${s.id}`, { method: 'PUT', body: JSON.stringify(s) })
      : req('/schedules', { method: 'POST', body: JSON.stringify(s) });
  },
  async deleteSchedule(id: string): Promise<void> {
    await req(`/schedules/${id}`, { method: 'DELETE' });
  },
  async clearSchedules(): Promise<void> {
    await req('/schedules', { method: 'DELETE' });
  },

  async generateSchedule(): Promise<{ schedules: ScheduleEntry[]; conflicts: string[] }> {
    return req('/schedules/generate', { method: 'POST' });
  },

  // Settings
  async getSettings(): Promise<Record<string, string>> {
    return req('/settings');
  },
  async saveSettings(data: Record<string, string>): Promise<void> {
    await req('/settings', { method: 'PUT', body: JSON.stringify(data) });
  },

  // Academic Years
  async getAcademicYears(): Promise<AcademicYear[]> {
    return req('/academic-years');
  },
  async saveAcademicYear(ay: AcademicYear): Promise<AcademicYear> {
    const method = ay.id && await fetch(`${BASE}/academic-years/${ay.id}`, { method: 'HEAD' }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/academic-years/${ay.id}`, { method: 'PUT', body: JSON.stringify(ay) })
      : req('/academic-years', { method: 'POST', body: JSON.stringify(ay) });
  },
  async deleteAcademicYear(id: string): Promise<void> {
    await req(`/academic-years/${id}`, { method: 'DELETE' });
  },

  // Import
  async importTeachers(file: File): Promise<{ imported: number }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/import/teachers`, { method: 'POST', body: file });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importSubjects(file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/subjects`, { method: 'POST', body: file });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importClasses(file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/classes`, { method: 'POST', body: file });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importRooms(file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/rooms`, { method: 'POST', body: file });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },

  // Templates
  async downloadTemplate(type: 'teachers' | 'subjects' | 'classes' | 'rooms'): Promise<void> {
    const res = await fetch(`${BASE}/templates/${type}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${type}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
