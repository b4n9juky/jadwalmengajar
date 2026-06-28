import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import * as XLSX from 'xlsx';
import { useAcademicYear } from '../contexts/AcademicYearContext';
import {
  useSchedules, useTimeSlots, useTeachers, useSubjects,
  useClasses, useRooms, useSettings,
} from '../hooks/useQueries';
import type {
  ScheduleEntry, Teacher, Subject, ClassGroup, Room, TimeSlot,
} from '../types';
import { getDays, getMaxDay, SUBJECT_COLORS } from '../types';

interface DragItem {
  entry: ScheduleEntry;
  subjectName: string;
  teacherName: string;
  className: string;
  roomName: string;
  color: string;
}

export default function Schedule() {
  const { currentYear } = useAcademicYear();
  const ayId = currentYear?.id;

  const { data: schedules, save, clear, generate } = useSchedules(ayId);
  const { data: allTimeSlots } = useTimeSlots(ayId);
  const { data: teachers } = useTeachers(ayId);
  const { data: subjects } = useSubjects(ayId);
  const { data: classes } = useClasses(ayId);
  const { data: rooms } = useRooms(ayId);
  const { data: settings } = useSettings();

  const schoolType = settings?.schoolType || 'negeri';
  const days = getDays(schoolType);
  const maxDay = getMaxDay(schoolType);
  const dayNumbers = Array.from({ length: maxDay }, (_, i) => i + 1);

  const timeSlots = useMemo(
    () => allTimeSlots.filter((x) => x.type === 'teaching').sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime)),
    [allTimeSlots],
  );

  const [conflicts, setConflicts] = useState<string[]>([]);
  const [activeDrag, setActiveDrag] = useState<DragItem | null>(null);

  const handleGenerate = async () => {
    const result = await generate.mutateAsync();
    setConflicts(result.conflicts);
  };

  const handleClear = async () => {
    if (window.confirm('Hapus semua jadwal?')) {
      await clear.mutateAsync();
      setConflicts([]);
    }
  };

  const exportExcel = () => {
    const rows: Record<string, string>[] = [];
    for (const s of schedules) {
      const slot = timeSlots.find((ts) => ts.id === s.timeSlotId);
      const teacher = teachers.find((t) => t.id === s.teacherId);
      const subject = subjects.find((sub) => sub.id === s.subjectId);
      const cls = classes.find((c) => c.id === s.classId);
      const room = rooms.find((r) => r.id === s.roomId);
      rows.push({
        Hari: days[slot ? slot.dayOfWeek - 1 : 0],
        Waktu: slot ? `${slot.startTime} - ${slot.endTime}` : '-',
        'Mata Pelajaran': subject?.name || '-',
        Guru: teacher?.name || '-',
        Kelas: cls?.name || '-',
        Ruangan: room?.name || '-',
      });
    }

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws1, 'Jadwal');

    if (conflicts.length > 0) {
      const conflictRows = conflicts.map((c) => ({ Keterangan: c }));
      const ws2 = XLSX.utils.json_to_sheet(conflictRows);
      XLSX.utils.book_append_sheet(wb, ws2, 'Konflik');
    }

    ws1['!cols'] = [
      { wch: 10 }, { wch: 18 }, { wch: 22 }, { wch: 30 }, { wch: 10 }, { wch: 16 },
    ];

    XLSX.writeFile(wb, `jadwal_sekolah_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const findDragItem = (id: string): DragItem | null => {
    const entry = schedules.find((e) => e.id === id);
    if (!entry) return null;
    const teacher = teachers.find((t) => t.id === entry.teacherId);
    const subject = subjects.find((s) => s.id === entry.subjectId);
    const cls = classes.find((c) => c.id === entry.classId);
    const room = rooms.find((r) => r.id === entry.roomId);
    const subjectIdx = subjects.findIndex((s) => s.id === entry.subjectId);
    const color = SUBJECT_COLORS[subjectIdx % SUBJECT_COLORS.length];
    return {
      entry,
      subjectName: subject?.name || '?',
      teacherName: teacher?.name || '?',
      className: cls?.name || '?',
      roomName: room?.name || '?',
      color,
    };
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const item = findDragItem(id);
    if (item) setActiveDrag(item);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const entry = schedules.find((e) => e.id === active.id);
    if (!entry) return;

    const targetSlotId = over.id as string;
    const targetSlot = timeSlots.find((ts) => ts.id === targetSlotId);
    if (!targetSlot) return;

    const updateConflict = checkConflict(entry, targetSlot, schedules, teachers, subjects, classes, rooms);
    if (updateConflict) {
      setConflicts([updateConflict]);
      return;
    }

    await save.mutateAsync({ ...entry, timeSlotId: targetSlotId });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Jadwal Pelajaran</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={handleClear}>Hapus Semua</button>
          <button className="btn btn-outline" onClick={exportExcel} disabled={schedules.length === 0}>
            Export Excel
          </button>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generate.isPending}>
            {generate.isPending ? 'Memproses...' : 'Buat Jadwal Otomatis'}
          </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="conflict-banner">
          <strong>Konflik / Peringatan:</strong>
          <ul className="conflict-list">
            {conflicts.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="timeline-container">
          <div className={`schedule-grid${maxDay === 6 ? ' days-6' : ''}`}>
            <div className="schedule-day-header">Waktu</div>
            {days.map((d) => <div key={d} className="schedule-day-header">{d}</div>)}

            {timeSlots.map((slot, idx) => {
              const daySlots = dayNumbers.map((day) => {
                const dayTeaching = timeSlots.filter((ts) => ts.dayOfWeek === day);
                return dayTeaching[idx] || null;
              });
              const refSlot = daySlots.find(Boolean) || slot;

              return (
                <ScheduleRow
                  key={slot.id}
                  slot={refSlot}
                  daySlots={daySlots as (TimeSlot | undefined)[]}
                  schedules={schedules}
                  teachers={teachers}
                  subjects={subjects}
                  classes={classes}
                  rooms={rooms}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeDrag && (
            <div
              className="schedule-slot"
              style={{
                background: activeDrag.color + '22',
                borderColor: activeDrag.color,
                padding: '6px 10px',
                minWidth: 140,
              }}
            >
              <div className="subject-name" style={{ color: activeDrag.color }}>
                {activeDrag.subjectName}
              </div>
              <div className="slot-detail">
                {activeDrag.teacherName} · {activeDrag.className} · {activeDrag.roomName}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {schedules.length === 0 && (
        <div className="data-table-wrapper" style={{ marginTop: '1rem' }}>
          <div className="empty-state">
            <p>Belum ada jadwal. Klik "Buat Jadwal Otomatis" untuk menghasilkan jadwal.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleRow({
  slot, daySlots, schedules, teachers, subjects, classes, rooms,
}: {
  slot: TimeSlot;
  daySlots: (TimeSlot | undefined)[];
  schedules: ScheduleEntry[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassGroup[];
  rooms: Room[];
}) {
  return (
    <>
      <div className="schedule-time-header">
        {slot.startTime}<br />
        <span style={{ fontWeight: 400, fontSize: '.625rem' }}>{slot.endTime}</span>
      </div>
      {daySlots.map((ts, idx) => {
        const day = idx + 1;
        if (!ts) return <div key={day} className="schedule-cell" />;
        const daySchedules = schedules.filter((s) => s.timeSlotId === ts.id);

        return (
          <div key={day} className="schedule-cell">
            <DroppableSlot id={ts.id}>
              {daySchedules.map((sch) => {
                const teacher = teachers.find((t) => t.id === sch.teacherId);
                const subject = subjects.find((s) => s.id === sch.subjectId);
                const cls = classes.find((c) => c.id === sch.classId);
                const room = rooms.find((r) => r.id === sch.roomId);
                const subjectIdx = subjects.findIndex((s) => s.id === sch.subjectId);
                const color = SUBJECT_COLORS[subjectIdx % SUBJECT_COLORS.length];

                return (
                  <DraggableSchedule
                    key={sch.id}
                    schedule={sch}
                    color={color}
                    subjectName={subject?.name || '?'}
                    teacherName={teacher?.name || '?'}
                    className={cls?.name || '?'}
                    roomName={room?.name || '?'}
                  />
                );
              })}
            </DroppableSlot>
          </div>
        );
      })}
    </>
  );
}

function DroppableSlot({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 70,
        background: isOver ? '#eef2ff' : undefined,
        borderRadius: 4,
        transition: 'background .15s',
      }}
    >
      {children}
    </div>
  );
}

function DraggableSchedule({
  schedule, color, subjectName, teacherName, className, roomName,
}: {
  schedule: ScheduleEntry;
  color: string;
  subjectName: string;
  teacherName: string;
  className: string;
  roomName: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: schedule.id });

  const style: React.CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`schedule-slot ${isDragging ? 'dragging' : ''}`}
      style={{
        ...style,
        background: color + '18',
        borderColor: color + '55',
      }}
    >
      <div className="subject-name" style={{ color }}>{subjectName}</div>
      <div className="slot-detail">{teacherName}</div>
      <div className="slot-detail">{className} · {roomName}</div>
    </div>
  );
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function checkConflict(
  entry: ScheduleEntry,
  targetSlot: TimeSlot,
  schedules: ScheduleEntry[],
  teachers: Teacher[],
  _subjects: Subject[],
  classes: ClassGroup[],
  rooms: Room[],
): string | null {
  const others = schedules.filter((s) => s.id !== entry.id && s.timeSlotId === targetSlot.id);

  for (const other of others) {
    if (other.teacherId === entry.teacherId) {
      const t = teachers.find((x) => x.id === entry.teacherId);
      return `Konflik: ${t?.name || 'Guru'} sudah memiliki jadwal di slot ini`;
    }
    if (other.classId === entry.classId) {
      const c = classes.find((x) => x.id === entry.classId);
      return `Konflik: Kelas ${c?.name || '?'} sudah memiliki jadwal di slot ini`;
    }
    if (other.roomId === entry.roomId) {
      const r = rooms.find((x) => x.id === entry.roomId);
      return `Konflik: ${r?.name || 'Ruangan'} sudah digunakan di slot ini`;
    }
  }

  return null;
}
