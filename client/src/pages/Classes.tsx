import { useRef, useState } from 'react';
import { api } from '../api/client';
import { useAcademicYear } from '../contexts/AcademicYearContext';
import { useClasses } from '../hooks/useQueries';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { ClassGroup } from '../types';
import { v4 as uuid } from 'uuid';

const empty: ClassGroup = { id: '', name: '', gradeLevel: 7, section: '', academicYearId: '' };

const GRADE_OPTIONS = [
  { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' },
  { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
];

export default function Classes() {
  const { currentYear } = useAcademicYear();
  const ayId = currentYear?.id;
  const { data, save, remove, refetch } = useClasses(ayId);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<ClassGroup | null>(null);
  const [form, setForm] = useState(empty);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const add = () => { setEdit(null); setForm({ ...empty, id: uuid(), academicYearId: ayId! }); setShow(true); };
  const openEdit = (c: ClassGroup) => { setEdit(c); setForm({ ...c }); setShow(true); };

  const handleSave = async () => {
    await save.mutateAsync({ ...form, gradeLevel: Number(form.gradeLevel) });
    setShow(false);
  };

  const handleRemove = async (c: ClassGroup) => {
    if (window.confirm(`Hapus kelas ${c.name}?`)) await remove.mutateAsync(c.id);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ayId) return;
    setImporting(true);
    try {
      const result = await api.importClasses(ayId, file);
      alert(`Berhasil import ${result.imported} kelas`);
      refetch();
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
        <h1>Kelas</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => api.downloadTemplate('classes')}>
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
          <button className="btn btn-primary" onClick={add}>+ Tambah Kelas</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama Kelas' },
          { key: 'gradeLevel', header: 'Tingkat' },
          { key: 'section', header: 'Bagian' },
        ]}
        data={data}
        keyExtractor={(c) => c.id}
        onEdit={openEdit}
        onDelete={handleRemove}
        emptyMessage="Belum ada kelas"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Kelas' : 'Tambah Kelas'}
          fields={[
            { name: 'name', label: 'Nama Kelas', required: true, placeholder: '7A' },
            { name: 'gradeLevel', label: 'Tingkat', type: 'select', options: GRADE_OPTIONS, required: true },
            { name: 'section', label: 'Bagian', required: true, placeholder: 'A' },
          ]}
          values={form as unknown as Record<string, unknown>}
          onChange={set}
          onSave={handleSave}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
