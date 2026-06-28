import { Router } from 'express';
import * as XLSX from 'xlsx';

const router = Router();

function sendExcel(res: import('express').Response, filename: string, data: Record<string, string>[]) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
}

router.get('/teachers', (_req, res) => {
  sendExcel(res, 'template_guru.xlsx', [
    { Nama: 'Ahmad Fauzi', NIP: '196801011994031001', Telepon: '081234567890', Email: 'ahmad@sch.id' },
  ]);
});

router.get('/subjects', (_req, res) => {
  sendExcel(res, 'template_mata_pelajaran.xlsx', [
    { Nama: 'Matematika', Kode: 'MTK', 'Sesi/Minggu': '6' },
  ]);
});

router.get('/classes', (_req, res) => {
  sendExcel(res, 'template_kelas.xlsx', [
    { Nama: '7A', Tingkat: '7', Bagian: 'A' },
  ]);
});

router.get('/rooms', (_req, res) => {
  sendExcel(res, 'template_ruangan.xlsx', [
    { Nama: 'Ruang Kelas 1', Kode: 'RK1', Kapasitas: '32' },
  ]);
});

export default router;
