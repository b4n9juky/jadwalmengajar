import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { TeachingAssignment, Teacher, Subject, ClassGroup } from '../types';
import { v4 as uuid } from 'uuid';

const empty: TeachingAssignment = { id: '', teacherId: '', subjectId: '', classId: '', sessionsPerWeek: 2 };

export default function Assignments() {
  const [data, setData] = useState<TeachingAssignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<TeachingAssignment | null>(null);
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    Promise.all([api.getAssignments(), api.getTeachers(), api.getSubjects(), api.getClasses()]).then(
      ([a, t, s, c]) => { setData(a); setTeachers(t); setSubjects(s); setClasses(c); }
    );
  }, []);

  useEffect(load, [load]);

  const add = () => { setEdit(null); setForm({ ...empty, id: uuid() }); setShow(true); };
  const openEdit = (a: TeachingAssignment) => { setEdit(a); setForm({ ...a }); setShow(true); };

  const save = async () => {
    await api.saveAssignment({ ...form, sessionsPerWeek: Number(form.sessionsPerWeek) });
    setShow(false);
    load();
  };

  const remove = async (a: TeachingAssignment) => {
    if (window.confirm('Hapus pengajaran ini?')) { await api.deleteAssignment(a.id); load(); }
  };

  const set = (name: string, value: string) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div>
      <div className="page-header">
        <h1>Pengajaran</h1>
        <button className="btn btn-primary" onClick={add}>+ Tambah Pengajaran</button>
      </div>
      <p className="text-sm text-secondary mb-2">
        Tentukan guru mana yang mengajar mata pelajaran apa untuk kelas tertentu, beserta jumlah sesi per minggu.
      </p>
      <DataTable
        columns={[
          { key: 'teacherId', header: 'Guru', render: (a) => teachers.find((t) => t.id === a.teacherId)?.name || '-' },
          { key: 'subjectId', header: 'Mapel', render: (a) => subjects.find((s) => s.id === a.subjectId)?.name || '-' },
          { key: 'classId', header: 'Kelas', render: (a) => classes.find((c) => c.id === a.classId)?.name || '-' },
          { key: 'sessionsPerWeek', header: 'Sesi/Minggu' },
        ]}
        data={data}
        keyExtractor={(a) => a.id}
        onEdit={openEdit}
        onDelete={remove}
        emptyMessage="Belum ada pengajaran"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Pengajaran' : 'Tambah Pengajaran'}
          fields={[
            { name: 'teacherId', label: 'Guru', type: 'select', options: teachers.map((t) => ({ value: t.id, label: t.name })), required: true },
            { name: 'subjectId', label: 'Mata Pelajaran', type: 'select', options: subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })), required: true },
            { name: 'classId', label: 'Kelas', type: 'select', options: classes.map((c) => ({ value: c.id, label: c.name })), required: true },
            { name: 'sessionsPerWeek', label: 'Jumlah Sesi per Minggu', type: 'number', required: true, min: 1 },
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
