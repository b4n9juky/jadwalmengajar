import type {
  Teacher, Subject, ClassGroup, Room, TimeSlot,
  TeacherAvailability, TeachingAssignment, ScheduleEntry,
  AcademicYear,
} from '../types';

const BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    ...init,
  });
  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Sesi berakhir');
  }
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  // Teachers
  async getTeachers(academicYearId: string): Promise<Teacher[]> {
    return req(`/teachers?academicYearId=${academicYearId}`);
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
  async getSubjects(academicYearId: string): Promise<Subject[]> {
    return req(`/subjects?academicYearId=${academicYearId}`);
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
  async getClasses(academicYearId: string): Promise<ClassGroup[]> {
    return req(`/classes?academicYearId=${academicYearId}`);
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
  async getRooms(academicYearId: string): Promise<Room[]> {
    return req(`/rooms?academicYearId=${academicYearId}`);
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
  async getTimeSlots(academicYearId: string): Promise<TimeSlot[]> {
    return req(`/time-slots?academicYearId=${academicYearId}`);
  },
  async saveTimeSlot(ts: TimeSlot): Promise<TimeSlot> {
    const exists = ts.id && await fetch(`${BASE}/time-slots/${ts.id}`, { method: 'HEAD' }).then(r => r.ok);
    if (exists) {
      return req(`/time-slots/${ts.id}`, { method: 'PUT', body: JSON.stringify(ts) });
    }
    return req('/time-slots', { method: 'POST', body: JSON.stringify(ts) });
  },
  async saveAllTimeSlots(academicYearId: string, slots: TimeSlot[]): Promise<TimeSlot[]> {
    return req('/time-slots', { method: 'PUT', body: JSON.stringify({ academicYearId, slots }) });
  },

  // Availabilities
  async getAvailabilities(academicYearId: string): Promise<TeacherAvailability[]> {
    return req(`/availabilities?academicYearId=${academicYearId}`);
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
  async getAssignments(academicYearId: string): Promise<TeachingAssignment[]> {
    return req(`/assignments?academicYearId=${academicYearId}`);
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
  async getSchedules(academicYearId: string): Promise<ScheduleEntry[]> {
    return req(`/schedules?academicYearId=${academicYearId}`);
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
  async clearSchedules(academicYearId: string): Promise<void> {
    await req(`/schedules?academicYearId=${academicYearId}`, { method: 'DELETE' });
  },

  async generateSchedule(academicYearId: string): Promise<{ schedules: ScheduleEntry[]; conflicts: string[] }> {
    return req('/schedules/generate', { method: 'POST', body: JSON.stringify({ academicYearId }) });
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
    const method = ay.id && await fetch(`${BASE}/academic-years/${ay.id}`, { method: 'HEAD', headers: getAuthHeaders() }).then(r => r.ok) ? 'PUT' : 'POST';
    return method === 'PUT'
      ? req(`/academic-years/${ay.id}`, { method: 'PUT', body: JSON.stringify(ay) })
      : req('/academic-years', { method: 'POST', body: JSON.stringify(ay) });
  },
  async deleteAcademicYear(id: string): Promise<void> {
    await req(`/academic-years/${id}`, { method: 'DELETE' });
  },

  // Import
  async importTeachers(academicYearId: string, file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/teachers?academicYearId=${academicYearId}`, { method: 'POST', body: file, headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importSubjects(academicYearId: string, file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/subjects?academicYearId=${academicYearId}`, { method: 'POST', body: file, headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importClasses(academicYearId: string, file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/classes?academicYearId=${academicYearId}`, { method: 'POST', body: file, headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },
  async importRooms(academicYearId: string, file: File): Promise<{ imported: number }> {
    const res = await fetch(`${BASE}/import/rooms?academicYearId=${academicYearId}`, { method: 'POST', body: file, headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Import error: ${res.status}`);
    return res.json();
  },

  // Templates
  async downloadTemplate(type: 'teachers' | 'subjects' | 'classes' | 'rooms'): Promise<void> {
    const res = await fetch(`${BASE}/templates/${type}`, { headers: getAuthHeaders() });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${type}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
