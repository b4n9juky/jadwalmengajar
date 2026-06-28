import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { Teacher } from '../types';
import { v4 as uuid } from 'uuid';

const empty: Teacher = { id: '', name: '', nip: '', phone: '', email: '' };

export default function Teachers() {
  const [data, setData] = useState<Teacher[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Teacher | null>(null);
  const [form, setForm] = useState(empty);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => { api.getTeachers().then(setData); }, []);

  useEffect(load, [load]);

  const openAdd = () => { setEdit(null); setForm({ ...empty, id: uuid() }); setShow(true); };
  const openEdit = (t: Teacher) => { setEdit(t); setForm({ ...t }); setShow(true); };

  const save = async () => {
    await api.saveTeacher(form);
    setShow(false);
    load();
  };

  const remove = async (t: Teacher) => {
    if (window.confirm(`Hapus guru ${t.name}?`)) {
      await api.deleteTeacher(t.id);
      load();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await api.importTeachers(file);
      alert(`Berhasil import ${result.imported} guru`);
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
        <h1>Data Guru</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => api.downloadTemplate('teachers')}>
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
          <button className="btn btn-primary" onClick={openAdd}>+ Tambah Guru</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama' },
          { key: 'nip', header: 'NIP' },
          { key: 'phone', header: 'Telepon' },
          { key: 'email', header: 'Email' },
        ]}
        data={data}
        keyExtractor={(t) => t.id}
        onEdit={openEdit}
        onDelete={remove}
        emptyMessage="Belum ada data guru"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Guru' : 'Tambah Guru'}
          fields={[
            { name: 'name', label: 'Nama Lengkap', required: true, placeholder: 'Dr. Ahmad Fauzi' },
            { name: 'nip', label: 'NIP', required: true, placeholder: '196801011994031001' },
            { name: 'phone', label: 'Telepon', placeholder: '081234567890' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'ahmad@sch.id' },
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
