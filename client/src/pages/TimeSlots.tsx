import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { TimeSlot } from '../types';
import { getDays, getMaxDay } from '../types';
import { v4 as uuid } from 'uuid';

export default function TimeSlots() {
  const [data, setData] = useState<TimeSlot[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [schoolType, setSchoolType] = useState('negeri');

  const days = getDays(schoolType);
  const maxDay = getMaxDay(schoolType);

  const load = useCallback(() => {
    Promise.all([api.getTimeSlots(), api.getSettings()]).then(([slots, settings]) => {
      setData(slots);
      setSchoolType(settings.schoolType || 'negeri');
    });
  }, []);
  useEffect(load, [load]);

  const sorted = [...data].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek || timeToMin(a.startTime) - timeToMin(b.startTime)
  );

  const updateSlot = async (id: string, patch: Partial<TimeSlot>) => {
    const slot = data.find((s) => s.id === id);
    if (!slot) return;
    await api.saveTimeSlot({ ...slot, ...patch });
    load();
  };

  const addSlot = async (day: number) => {
    const daySlots = data.filter((s) => s.dayOfWeek === day).sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime));
    const last = daySlots[daySlots.length - 1];
    const start = last ? last.endTime : '07:30';
    const startM = timeToMin(start);
    const end = minutesToTime(startM + 45);
    await api.saveTimeSlot({
      id: uuid(),
      dayOfWeek: day,
      startTime: start,
      endTime: end,
      type: 'teaching',
    });
    load();
  };

  const removeSlot = async (slot: TimeSlot) => {
    const all = await api.getTimeSlots();
    await api.saveAllTimeSlots(all.filter((s) => s.id !== slot.id));
    load();
  };

  const fixTimeAfterEdit = (slot: TimeSlot, field: 'startTime' | 'endTime', rawValue: string) => {
    const oldVal = slot[field];
    if (rawValue === oldVal) return;
    const patch: Partial<TimeSlot> = {};
    patch[field] = rawValue;
    if (field === 'startTime') {
      const startM = timeToMin(rawValue);
      const endM = timeToMin(slot.endTime);
      if (endM <= startM) patch.endTime = minutesToTime(startM + 45);
    }
    if (field === 'endTime') {
      const endM = timeToMin(rawValue);
      const startM = timeToMin(slot.startTime);
      if (endM <= startM) return;
    }
    updateSlot(slot.id, patch);
    setEditingId(null);
  };

  const resetToDefault = async () => {
    const store = await api.getTimeSlots();
    const oldIds = new Set(store.map((s) => s.id));
    const defaults = generateDefaultTimeSlots(maxDay);
    const merged = defaults.map((d, i) => ({ ...d, id: [...oldIds][i] || uuid() }));
    await api.saveAllTimeSlots(merged);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Slot Waktu</h1>
        <button className="btn btn-outline" onClick={resetToDefault}>Reset ke Default</button>
      </div>
      <p className="text-sm text-secondary mb-2">
        Atur slot waktu pelajaran per hari. Setiap slot punya durasi fleksibel — klik waktu untuk mengedit. Break (istirahat) tidak digunakan dalam penjadwalan otomatis.
      </p>
      <div className="timeline-container">
        <div className="schedule-grid">
          <div className="schedule-day-header">Waktu</div>
          {days.map((d) => <div key={d} className="schedule-day-header">{d}</div>)}

          {renderTimeRows(sorted, editingId, setEditingId, updateSlot, fixTimeAfterEdit, addSlot, removeSlot, maxDay)}
        </div>
      </div>
    </div>
  );
}

function renderTimeRows(
  data: TimeSlot[],
  editingId: string | null,
  setEditingId: (id: string | null) => void,
  updateSlot: (id: string, patch: Partial<TimeSlot>) => void,
  fixTimeAfterEdit: (slot: TimeSlot, field: 'startTime' | 'endTime', value: string) => void,
  addSlot: (day: number) => void,
  removeSlot: (slot: TimeSlot) => void,
  maxDay: number,
) {
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const maxSlotsPerDay = Math.max(...days.map((d) => data.filter((s) => s.dayOfWeek === d).length));
  const rows: React.ReactNode[] = [];

  for (let i = 0; i < maxSlotsPerDay; i++) {
    const refSlot = data.filter((s) => s.dayOfWeek === 1).sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime))[i];

    rows.push(
      <div key={`time-${i}`} className="schedule-time-header" style={{ fontSize: '.625rem' }}>
        {refSlot ? `${refSlot.startTime}\n${refSlot.endTime}` : ''}
      </div>
    );

    for (const day of days) {
      const daySlots = data.filter((s) => s.dayOfWeek === day).sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime));
      const slot = daySlots[i];

      if (!slot) {
        rows.push(
          <div key={`${day}-${i}-empty`} className="schedule-cell" style={{ background: '#f8fafc' }} />
        );
        continue;
      }

      const isEditing = editingId === slot.id;
      const isBreak = slot.type === 'break';

      rows.push(
        <div
          key={slot.id}
          className="schedule-cell"
          style={{
            background: isBreak ? '#fef3c7' : '#f0fdf4',
            border: isBreak ? '1px solid #fde68a' : '1px solid #bbf7d0',
            padding: 4,
          }}
        >
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TimeInput
                value={slot.startTime}
                onChange={(v) => fixTimeAfterEdit(slot, 'startTime', v)}
                onBlur={() => setEditingId(null)}
              />
              <span style={{ fontSize: '.5625rem', textAlign: 'center', color: '#94a3b8' }}>s/d</span>
              <TimeInput
                value={slot.endTime}
                onChange={(v) => fixTimeAfterEdit(slot, 'endTime', v)}
                onBlur={() => setEditingId(null)}
              />
              <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                <TypeToggle type={slot.type} onChange={(t) => updateSlot(slot.id, { type: t })} />
              </div>
            </div>
          ) : (
            <div
              style={{ cursor: 'pointer', minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
              onClick={() => setEditingId(slot.id)}
            >
              <span style={{ fontSize: '.6875rem', fontWeight: 600 }}>{slot.startTime} - {slot.endTime}</span>
              {isBreak && <span className="break-badge">Istirahat</span>}
              <span style={{ fontSize: '.5625rem', color: '#94a3b8' }}>
                {durasi(slot.startTime, slot.endTime)}
              </span>
            </div>
          )}

          <span
            className="btn-icon"
            style={{ position: 'absolute', top: 1, right: 1, width: 18, height: 18, fontSize: '.4375rem' }}
            onClick={(e) => { e.stopPropagation(); removeSlot(slot); }}
          >✕</span>
        </div>
      );
    }
  }

  // Add-row
  rows.push(
    <div key="add-label" className="schedule-time-header" style={{ fontSize: '.625rem', color: '#94a3b8' }}>+</div>
  );
  for (const day of days) {
    rows.push(
      <div
        key={`add-${day}`}
        className="schedule-cell"
        style={{ cursor: 'pointer', minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => addSlot(day)}
      >
        <span style={{ fontSize: '.625rem', color: '#94a3b8' }}>+ Tambah Slot</span>
      </div>
    );
  }

  return rows;
}

function TimeInput({ value, onChange, onBlur }: { value: string; onChange: (v: string) => void; onBlur: () => void }) {
  return (
    <input
      type="time"
      defaultValue={value}
      style={{ fontSize: '.625rem', width: '100%', padding: 1, border: '1px solid #cbd5e1', borderRadius: 2, textAlign: 'center' }}
      onBlur={(e) => { onChange(e.target.value); onBlur(); }}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
    />
  );
}

function TypeToggle({ type, onChange }: { type: 'teaching' | 'break'; onChange: (t: 'teaching' | 'break') => void }) {
  return (
    <select
      value={type}
      onChange={(e) => onChange(e.target.value as 'teaching' | 'break')}
      style={{ fontSize: '.5625rem', width: '100%', padding: 1, border: '1px solid #cbd5e1', borderRadius: 2 }}
    >
      <option value="teaching">Mengajar</option>
      <option value="break">Istirahat</option>
    </select>
  );
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function durasi(start: string, end: string): string {
  const d = timeToMin(end) - timeToMin(start);
  if (d < 60) return `${d} mnt`;
  return `${Math.floor(d / 60)} j ${d % 60} mnt`;
}

function generateDefaultTimeSlots(maxDay: number): TimeSlot[] {
  const DEFAULT_SLOTS: { start: string; end: string; type: 'teaching' | 'break' }[] = [
    { start: '07:30', end: '08:15', type: 'teaching' },
    { start: '08:15', end: '09:00', type: 'teaching' },
    { start: '09:00', end: '09:15', type: 'break' },
    { start: '09:15', end: '10:00', type: 'teaching' },
    { start: '10:00', end: '10:45', type: 'teaching' },
    { start: '10:45', end: '11:30', type: 'teaching' },
    { start: '11:30', end: '12:15', type: 'break' },
    { start: '12:15', end: '13:00', type: 'teaching' },
    { start: '13:00', end: '13:45', type: 'teaching' },
    { start: '13:45', end: '14:30', type: 'teaching' },
    { start: '14:30', end: '15:15', type: 'teaching' },
  ];
  const slots: TimeSlot[] = [];
  let id = 1;
  for (let day = 1; day <= maxDay; day++) {
    for (const s of DEFAULT_SLOTS) {
      slots.push({ id: `ts${id++}`, dayOfWeek: day, startTime: s.start, endTime: s.end, type: s.type });
    }
  }
  return slots;
}
