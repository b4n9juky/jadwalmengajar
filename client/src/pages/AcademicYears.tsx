import { useState } from 'react';
import { useAcademicYears } from '../hooks/useQueries';
import type { AcademicYear } from '../types';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import { v4 as uuid } from 'uuid';

export default function AcademicYears() {
  const { data, save, remove } = useAcademicYears();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AcademicYear | null>(null);
  const [form, setForm] = useState({ tahunAjaran: '', semester: 'ganjil' as 'ganjil' | 'genap' });

  const openAdd = () => {
    setEditing(null);
    setForm({ tahunAjaran: '', semester: 'ganjil' });
    setShowModal(true);
  };

  const openEdit = (item: AcademicYear) => {
    setEditing(item);
    setForm({ tahunAjaran: item.tahunAjaran, semester: item.semester });
    setShowModal(true);
  };

  const handleSave = async () => {
    await save.mutateAsync({
      id: editing?.id || uuid(),
      tahunAjaran: form.tahunAjaran,
      semester: form.semester,
    });
    setShowModal(false);
  };

  const handleRemove = async (item: AcademicYear) => {
    if (window.confirm(`Hapus tahun ajaran ${item.tahunAjaran} ${item.semester}?`)) {
      await remove.mutateAsync(item.id);
    }
  };

  const fields = [
    { name: 'tahunAjaran', label: 'Tahun Ajaran', placeholder: '2025/2026', required: true },
    { name: 'semester', label: 'Semester', type: 'select' as const, options: [
      { value: 'ganjil', label: 'Ganjil' },
      { value: 'genap', label: 'Genap' },
    ], required: true },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Tahun Ajaran</h1>
        <button className="btn btn-primary" onClick={openAdd}>Tambah</button>
      </div>

      <DataTable
        columns={[
          { key: 'tahunAjaran', header: 'Tahun Ajaran' },
          { key: 'semester', header: 'Semester', render: (item) => item.semester === 'ganjil' ? 'Ganjil' : 'Genap' },
        ]}
        data={data}
        keyExtractor={(item) => item.id}
        onEdit={openEdit}
        onDelete={handleRemove}
      />

      {showModal && (
        <FormModal
          title={editing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
          fields={fields}
          values={form}
          onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
