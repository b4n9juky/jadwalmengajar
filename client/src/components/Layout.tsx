import { NavLink } from 'react-router-dom';

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
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">JadwalAuto</div>
        <nav>
          <div className="sidebar-section">Menu</div>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
