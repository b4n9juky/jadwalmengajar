import { Link } from 'react-router-dom';
import { useAcademicYear } from '../contexts/AcademicYearContext';
import { useTeachers, useSubjects, useClasses, useRooms, useAssignments, useSchedules, useSettings } from '../hooks/useQueries';

export default function Dashboard() {
  const { currentYear } = useAcademicYear();
  const ayId = currentYear?.id;
  const { data: teachers } = useTeachers(ayId);
  const { data: subjects } = useSubjects(ayId);
  const { data: classes } = useClasses(ayId);
  const { data: rooms } = useRooms(ayId);
  const { data: assignments } = useAssignments(ayId);
  const { data: schedules } = useSchedules(ayId);
  const { data: settings } = useSettings();

  const schoolType = settings?.schoolType || 'negeri';

  const cards = [
    { label: 'Guru', value: teachers.length, to: '/teachers', color: '#4f46e5' },
    { label: 'Mata Pelajaran', value: subjects.length, to: '/subjects', color: '#0891b2' },
    { label: 'Kelas', value: classes.length, to: '/classes', color: '#059669' },
    { label: 'Ruangan', value: rooms.length, to: '/rooms', color: '#d97706' },
    { label: 'Pengajaran', value: assignments.length, to: '/assignments', color: '#7c3aed' },
    { label: 'Jadwal Terisi', value: schedules.length, to: '/schedule', color: '#dc2626' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="stats-grid">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div className="label">{c.label}</div>
              <div className="value" style={{ color: c.color }}>{c.value}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="data-table-wrapper" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '.5rem' }}>Selamat Datang di JadwalAuto</h2>
        <p className="text-sm text-secondary">
          Tahun ajaran aktif: <strong>{currentYear?.tahunAjaran} - {currentYear?.semester === 'ganjil' ? 'Ganjil' : 'Genap'}</strong>.
          Jenis sekolah: <strong>{schoolType === 'negeri' ? 'Negeri (Senin-Jumat)' : 'Swasta (Senin-Sabtu)'}</strong>.
          Mulai dengan mengisi data guru, mata pelajaran, kelas,
          dan ruangan. Kemudian atur pengajaran dan biarkan sistem membuat jadwal secara otomatis.
        </p>
      </div>
    </div>
  );
}
