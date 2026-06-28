import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Settings() {
  const [schoolType, setSchoolType] = useState('negeri');
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    api.getSettings().then((s) => {
      setSchoolType(s.schoolType || 'negeri');
    });
  }, []);

  useEffect(load, [load]);

  const save = async () => {
    await api.saveSettings({ schoolType });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Pengaturan</h1>
      </div>

      <div className="data-table-wrapper" style={{ padding: '1.5rem', maxWidth: 500 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Jenis Sekolah</h2>
        <p className="text-sm text-secondary" style={{ marginBottom: '1rem' }}>
          Pilih jenis sekolah untuk menentukan jadwal mingguan. Sekolah negeri menggunakan hari Senin–Jumat,
          sedangkan sekolah swasta menggunakan hari Senin–Sabtu.
        </p>

        <div className="form-group">
          <label>Tipe Sekolah</label>
          <select
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="negeri">Sekolah Negeri (Senin–Jumat)</option>
            <option value="swasta">Sekolah Swasta (Senin–Sabtu)</option>
          </select>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={save}>
            {saved ? 'Tersimpan!' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  );
}
