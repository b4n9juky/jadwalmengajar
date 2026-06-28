import { NavLink } from 'react-router-dom';
import { useAcademicYear } from '../contexts/AcademicYearContext';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/teachers', label: 'Guru', icon: '👨‍🏫' },
  { to: '/subjects', label: 'Mata Pelajaran', icon: '📚' },
  { to: '/classes', label: 'Kelas', icon: '🏫' },
  { to: '/rooms', label: 'Ruangan', icon: '🚪' },
  { to: '/time-slots', label: 'Slot Waktu', icon: '⏰' },
  { to: '/availabilities', label: 'Ketersediaan Guru', icon: '📅' },
  { to: '/assignments', label: 'Pengajaran', icon: '📝' },
  { to: '/schedule', label: 'Jadwal', icon: '🗓️' },
  { to: '/academic-years', label: 'Tahun Ajaran', icon: '📆' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙️' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { academicYears, currentYear, setCurrentYear, loading } = useAcademicYear();
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">JadwalAuto</div>

        {!loading && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '.625rem', color: '#94a3b8', display: 'block', marginBottom: '.25rem' }}>
              Tahun Ajaran Aktif
            </label>
            <select
              value={currentYear?.id || ''}
              onChange={(e) => {
                const ay = academicYears.find((y) => y.id === e.target.value);
                if (ay) setCurrentYear(ay);
              }}
              style={{ width: '100%', fontSize: '.75rem', padding: '.375rem', border: '1px solid #cbd5e1', borderRadius: '.25rem' }}
            >
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>
                  {ay.tahunAjaran} - {ay.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                </option>
              ))}
            </select>
          </div>
        )}

        <nav>
          <div className="sidebar-section">Menu</div>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '.6875rem', color: '#64748b', marginBottom: '.375rem' }}>
            {user?.username}
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '.375rem',
              fontSize: '.75rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '.25rem',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            Keluar
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
