import { db } from './index';
import { teachers } from './schema/teachers';
import { subjects } from './schema/subjects';
import { classes } from './schema/classes';
import { rooms } from './schema/rooms';
import { timeSlots } from './schema/timeSlots';
import { assignments } from './schema/assignments';
import { schedules } from './schema/schedules';
import { availabilities } from './schema/availabilities';
import { settings } from './schema/settings';
import { academicYears } from './schema/academicYear';
import { v4 as uuid } from 'uuid';

const DEFAULT_SLOTS: { start: string; end: string; type: 'teaching' | 'break' }[] = [
  { start: '07:30', end: '08:15', type: 'teaching' },
  { start: '08:15', end: '09:00', type: 'teaching' },
  { start: '09:00', end: '09:15', type: 'break' },
  { start: '09:15', end: '10:00', type: 'teaching' },
  { start: '10:00', end: '10:45', type: 'teaching' },
  { start: '10:45', end: '11:30', type: 'teaching' },
  { start: '11:30', end: '12:15', type: 'break' },
  { start: '12:15', end: '13:00', type: 'teaching' },
  { start: '13:00', end: '13:45', type: 'teaching' },
  { start: '13:45', end: '14:30', type: 'teaching' },
  { start: '14:30', end: '15:15', type: 'teaching' },
];

async function seed() {
  console.log('Clearing existing data...');
  await db.delete(schedules);
  await db.delete(assignments);
  await db.delete(availabilities);
  await db.delete(timeSlots);
  await db.delete(rooms);
  await db.delete(classes);
  await db.delete(subjects);
  await db.delete(teachers);
  await db.delete(academicYears);
  await db.delete(settings);

  console.log('Seeding settings...');
  await db.insert(settings).values({ key: 'schoolType', value: 'negeri' });

  console.log('Seeding academic years...');
  const academicYearData = [
    { id: uuid(), tahunAjaran: '2025/2026', semester: 'ganjil' as const },
    { id: uuid(), tahunAjaran: '2025/2026', semester: 'genap' as const },
  ];
  await db.insert(academicYears).values(academicYearData);
  const ayId = academicYearData[0].id;

  console.log('Seeding teachers...');
  const teacherData = [
    { id: uuid(), academicYearId: ayId, name: 'Dr. Ahmad Fauzi', nip: '196801011994031001', phone: '081234567890', email: 'ahmad@sch.id' },
    { id: uuid(), academicYearId: ayId, name: 'Siti Rahmawati, S.Pd.', nip: '197205051997022002', phone: '081234567891', email: 'siti@sch.id' },
    { id: uuid(), academicYearId: ayId, name: 'Budi Santoso, M.Pd.', nip: '198003102001121003', phone: '081234567892', email: 'budi@sch.id' },
    { id: uuid(), academicYearId: ayId, name: 'Dewi Lestari, S.Si.', nip: '198505152005012004', phone: '081234567893', email: 'dewi@sch.id' },
    { id: uuid(), academicYearId: ayId, name: 'Hendra Gunawan, M.Kom.', nip: '199001202006041005', phone: '081234567894', email: 'hendra@sch.id' },
  ];
  await db.insert(teachers).values(teacherData);

  console.log('Seeding subjects...');
  const subjectData = [
    { id: uuid(), academicYearId: ayId, name: 'Matematika', code: 'MTK', totalSessions: 6 },
    { id: uuid(), academicYearId: ayId, name: 'Bahasa Indonesia', code: 'BIN', totalSessions: 6 },
    { id: uuid(), academicYearId: ayId, name: 'Bahasa Inggris', code: 'BIG', totalSessions: 4 },
    { id: uuid(), academicYearId: ayId, name: 'IPA', code: 'IPA', totalSessions: 4 },
    { id: uuid(), academicYearId: ayId, name: 'IPS', code: 'IPS', totalSessions: 4 },
    { id: uuid(), academicYearId: ayId, name: 'Pendidikan Agama', code: 'PAG', totalSessions: 2 },
    { id: uuid(), academicYearId: ayId, name: 'Olahraga', code: 'OLH', totalSessions: 2 },
    { id: uuid(), academicYearId: ayId, name: 'Seni Budaya', code: 'SBY', totalSessions: 2 },
  ];
  await db.insert(subjects).values(subjectData);

  console.log('Seeding classes...');
  const classData = [
    { id: uuid(), academicYearId: ayId, name: '7A', gradeLevel: 7, section: 'A' },
    { id: uuid(), academicYearId: ayId, name: '7B', gradeLevel: 7, section: 'B' },
    { id: uuid(), academicYearId: ayId, name: '8A', gradeLevel: 8, section: 'A' },
    { id: uuid(), academicYearId: ayId, name: '8B', gradeLevel: 8, section: 'B' },
  ];
  await db.insert(classes).values(classData);

  console.log('Seeding rooms...');
  const roomData = [
    { id: uuid(), academicYearId: ayId, name: 'Ruang Kelas 1', code: 'RK1', capacity: 32 },
    { id: uuid(), academicYearId: ayId, name: 'Ruang Kelas 2', code: 'RK2', capacity: 32 },
    { id: uuid(), academicYearId: ayId, name: 'Ruang Kelas 3', code: 'RK3', capacity: 32 },
    { id: uuid(), academicYearId: ayId, name: 'Lab Komputer', code: 'LABKOM', capacity: 24 },
    { id: uuid(), academicYearId: ayId, name: 'Lab IPA', code: 'LABIPA', capacity: 24 },
  ];
  await db.insert(rooms).values(roomData);

  console.log('Seeding time slots...');
  const slotData: { id: string; academicYearId: string; dayOfWeek: number; startTime: string; endTime: string; type: 'teaching' | 'break' }[] = [];
  for (let day = 1; day <= 6; day++) {
    for (const s of DEFAULT_SLOTS) {
      slotData.push({ id: uuid(), academicYearId: ayId, dayOfWeek: day, startTime: s.start, endTime: s.end, type: s.type });
    }
  }
  await db.insert(timeSlots).values(slotData);

  console.log('Seeding assignments...');
  const t = teacherData.map((x) => x.id);
  const s = subjectData.map((x) => x.id);
  const c = classData.map((x) => x.id);

  const assignmentData = [
    { id: uuid(), academicYearId: ayId, teacherId: t[0], subjectId: s[0], classId: c[0], sessionsPerWeek: 6 },
    { id: uuid(), academicYearId: ayId, teacherId: t[1], subjectId: s[1], classId: c[0], sessionsPerWeek: 6 },
    { id: uuid(), academicYearId: ayId, teacherId: t[2], subjectId: s[2], classId: c[0], sessionsPerWeek: 4 },
    { id: uuid(), academicYearId: ayId, teacherId: t[3], subjectId: s[3], classId: c[0], sessionsPerWeek: 4 },
    { id: uuid(), academicYearId: ayId, teacherId: t[0], subjectId: s[0], classId: c[1], sessionsPerWeek: 6 },
    { id: uuid(), academicYearId: ayId, teacherId: t[4], subjectId: s[5], classId: c[0], sessionsPerWeek: 2 },
  ];
  await db.insert(assignments).values(assignmentData);

  console.log('✅ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
