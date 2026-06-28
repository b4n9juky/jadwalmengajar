import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { Subject } from '../types';
import { v4 as uuid } from 'uuid';

const empty: Subject = { id: '', name: '', code: '', totalSessions: 0 };

export default function Subjects() {
  const [data, setData] = useState<Subject[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Subject | null>(null);
  const [form, setForm] = useState(empty);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => { api.getSubjects().then(setData); }, []);
  useEffect(load, [load]);

  const add = () => { setEdit(null); setForm({ ...empty, id: uuid() }); setShow(true); };
  const openEdit = (s: Subject) => { setEdit(s); setForm({ ...s }); setShow(true); };

  const save = async () => {
    await api.saveSubject({ ...form, totalSessions: Number(form.totalSessions) });
    setShow(false);
    load();
  };

  const remove = async (s: Subject) => {
    if (window.confirm(`Hapus ${s.name}?`)) { await api.deleteSubject(s.id); load(); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await api.importSubjects(file);
      alert(`Berhasil import ${result.imported} mata pelajaran`);
      load();
    } catch {
      alert('Gagal import file');
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const set = (name: string, value: string) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div>
      <div className="page-header">
        <h1>Mata Pelajaran</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => api.downloadTemplate('subjects')}>
            Download Template
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button
            className="btn btn-outline"
            onClick={() => fileRef.current?.click()}
            disabled={importing}
          >
            {importing ? 'Importing...' : 'Import Excel'}
          </button>
          <button className="btn btn-primary" onClick={add}>+ Tambah Mapel</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama' },
          { key: 'code', header: 'Kode' },
          { key: 'totalSessions', header: 'Total Sesi' },
        ]}
        data={data}
        keyExtractor={(s) => s.id}
        onEdit={openEdit}
        onDelete={remove}
        emptyMessage="Belum ada mata pelajaran"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Mapel' : 'Tambah Mapel'}
          fields={[
            { name: 'name', label: 'Nama', required: true, placeholder: 'Matematika' },
            { name: 'code', label: 'Kode', required: true, placeholder: 'MTK' },
            { name: 'totalSessions', label: 'Total Sesi per Minggu', type: 'number', required: true, min: 1 },
          ]}
          values={form as unknown as Record<string, unknown>}
          onChange={set}
          onSave={save}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
