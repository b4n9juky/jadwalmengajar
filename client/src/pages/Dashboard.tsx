import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ teachers: 0, subjects: 0, classes: 0, rooms: 0, assignments: 0, scheduled: 0 });
  const [schoolType, setSchoolType] = useState('negeri');

  useEffect(() => {
    Promise.all([
      api.getTeachers(), api.getSubjects(), api.getClasses(),
      api.getRooms(), api.getAssignments(), api.getSchedules(),
      api.getSettings(),
    ]).then(([teachers, subjects, classes, rooms, assignments, schedules, settings]) => {
      setStats({
        teachers: teachers.length,
        subjects: subjects.length,
        classes: classes.length,
        rooms: rooms.length,
        assignments: assignments.length,
        scheduled: schedules.length,
      });
      setSchoolType(settings.schoolType || 'negeri');
    });
  }, []);

  const cards = [
    { label: 'Guru', value: stats.teachers, to: '/teachers', color: '#4f46e5' },
    { label: 'Mata Pelajaran', value: stats.subjects, to: '/subjects', color: '#0891b2' },
    { label: 'Kelas', value: stats.classes, to: '/classes', color: '#059669' },
    { label: 'Ruangan', value: stats.rooms, to: '/rooms', color: '#d97706' },
    { label: 'Pengajaran', value: stats.assignments, to: '/assignments', color: '#7c3aed' },
    { label: 'Jadwal Terisi', value: stats.scheduled, to: '/schedule', color: '#dc2626' },
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
          Sistem penjadwalan otomatis untuk sekolah.
          Jenis sekolah: <strong>{schoolType === 'negeri' ? 'Negeri (Senin–Jumat)' : 'Swasta (Senin–Sabtu)'}</strong>.
          Mulai dengan mengisi data guru, mata pelajaran, kelas,
          dan ruangan. Kemudian atur pengajaran dan biarkan sistem membuat jadwal secara otomatis.
        </p>
      </div>
    </div>
  );
}
