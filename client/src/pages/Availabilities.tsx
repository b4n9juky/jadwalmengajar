import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { TeacherAvailability, Teacher } from '../types';
import { DAYS } from '../types';
import { v4 as uuid } from 'uuid';

const empty: TeacherAvailability = { id: '', teacherId: '', dayOfWeek: 1, startTime: '07:30', endTime: '15:30' };

export default function Availabilities() {
  const [data, setData] = useState<TeacherAvailability[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<TeacherAvailability | null>(null);
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    Promise.all([api.getAvailabilities(), api.getTeachers()]).then(([av, tch]) => {
      setData(av);
      setTeachers(tch);
    });
  }, []);

  useEffect(load, [load]);

  const add = () => { setEdit(null); setForm({ ...empty, id: uuid() }); setShow(true); };
  const openEdit = (a: TeacherAvailability) => { setEdit(a); setForm({ ...a }); setShow(true); };

  const save = async () => {
    await api.saveAvailability({ ...form, dayOfWeek: Number(form.dayOfWeek) });
    setShow(false);
    load();
  };

  const remove = async (a: TeacherAvailability) => {
    if (window.confirm('Hapus ketersediaan ini?')) { await api.deleteAvailability(a.id); load(); }
  };

  const set = (name: string, value: string) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div>
      <div className="page-header">
        <h1>Ketersediaan Guru</h1>
        <button className="btn btn-primary" onClick={add}>+ Tambah Ketersediaan</button>
      </div>
      <p className="text-sm text-secondary mb-2">
        Tentukan jam kerja dan hari tersedia untuk setiap guru.
      </p>
      <DataTable
        columns={[
          { key: 'teacherId', header: 'Guru', render: (a) => teachers.find((t) => t.id === a.teacherId)?.name || '-' },
          { key: 'dayOfWeek', header: 'Hari', render: (a) => DAYS[a.dayOfWeek - 1] || '-' },
          { key: 'startTime', header: 'Jam Mulai' },
          { key: 'endTime', header: 'Jam Selesai' },
        ]}
        data={data}
        keyExtractor={(a) => a.id}
        onEdit={openEdit}
        onDelete={remove}
        emptyMessage="Belum ada ketersediaan guru"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Ketersediaan' : 'Tambah Ketersediaan'}
          fields={[
            { name: 'teacherId', label: 'Guru', type: 'select', options: teachers.map((t) => ({ value: t.id, label: t.name })), required: true },
            { name: 'dayOfWeek', label: 'Hari', type: 'select', options: DAYS.map((d, i) => ({ value: String(i + 1), label: d })), required: true },
            { name: 'startTime', label: 'Jam Mulai', required: true, placeholder: '07:30' },
            { name: 'endTime', label: 'Jam Selesai', required: true, placeholder: '15:30' },
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
