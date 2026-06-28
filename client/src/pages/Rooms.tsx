import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import type { Room } from '../types';
import { v4 as uuid } from 'uuid';

const empty: Room = { id: '', name: '', code: '', capacity: 30 };

export default function Rooms() {
  const [data, setData] = useState<Room[]>([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Room | null>(null);
  const [form, setForm] = useState(empty);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => { api.getRooms().then(setData); }, []);
  useEffect(load, [load]);

  const add = () => { setEdit(null); setForm({ ...empty, id: uuid() }); setShow(true); };
  const openEdit = (r: Room) => { setEdit(r); setForm({ ...r }); setShow(true); };

  const save = async () => {
    await api.saveRoom({ ...form, capacity: Number(form.capacity) });
    setShow(false);
    load();
  };

  const remove = async (r: Room) => {
    if (window.confirm(`Hapus ${r.name}?`)) { await api.deleteRoom(r.id); load(); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await api.importRooms(file);
      alert(`Berhasil import ${result.imported} ruangan`);
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
        <h1>Ruangan</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => api.downloadTemplate('rooms')}>
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
          <button className="btn btn-primary" onClick={add}>+ Tambah Ruangan</button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: 'Nama' },
          { key: 'code', header: 'Kode' },
          { key: 'capacity', header: 'Kapasitas' },
        ]}
        data={data}
        keyExtractor={(r) => r.id}
        onEdit={openEdit}
        onDelete={remove}
        emptyMessage="Belum ada ruangan"
      />
      {show && (
        <FormModal
          title={edit ? 'Edit Ruangan' : 'Tambah Ruangan'}
          fields={[
            { name: 'name', label: 'Nama Ruangan', required: true, placeholder: 'Ruang Kelas 1' },
            { name: 'code', label: 'Kode Ruangan', required: true, placeholder: 'RK1' },
            { name: 'capacity', label: 'Kapasitas', type: 'number', required: true, min: 1 },
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
