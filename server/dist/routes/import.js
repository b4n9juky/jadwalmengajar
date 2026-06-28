import { Router } from 'express';
import { db } from '../db/index';
import { teachers } from '../db/schema/teachers';
import { subjects } from '../db/schema/subjects';
import { classes } from '../db/schema/classes';
import { rooms } from '../db/schema/rooms';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';
const router = Router();
function parseExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}
router.post('/teachers', async (req, res) => {
    try {
        const chunks = [];
        for await (const chunk of req)
            chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        const rows = parseExcel(buffer);
        const values = rows.map((row) => ({
            id: uuid(),
            name: String(row['Nama'] || row['name'] || ''),
            nip: String(row['NIP'] || row['nip'] || ''),
            phone: String(row['Telepon'] || row['phone'] || ''),
            email: String(row['Email'] || row['email'] || ''),
        })).filter((v) => v.name && v.nip);
        if (values.length === 0) {
            res.status(400).json({ error: 'Tidak ada data valid ditemukan' });
            return;
        }
        await db.insert(teachers).values(values);
        res.json({ imported: values.length });
    }
    catch (err) {
        res.status(500).json({ error: 'Gagal import guru' });
    }
});
router.post('/subjects', async (req, res) => {
    try {
        const chunks = [];
        for await (const chunk of req)
            chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        const rows = parseExcel(buffer);
        const values = rows.map((row) => ({
            id: uuid(),
            name: String(row['Nama'] || row['name'] || ''),
            code: String(row['Kode'] || row['code'] || ''),
            totalSessions: Number(row['Sesi/Minggu'] || row['totalSessions'] || 0),
        })).filter((v) => v.name && v.code);
        if (values.length === 0) {
            res.status(400).json({ error: 'Tidak ada data valid ditemukan' });
            return;
        }
        await db.insert(subjects).values(values);
        res.json({ imported: values.length });
    }
    catch (err) {
        res.status(500).json({ error: 'Gagal import mata pelajaran' });
    }
});
router.post('/classes', async (req, res) => {
    try {
        const chunks = [];
        for await (const chunk of req)
            chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        const rows = parseExcel(buffer);
        const values = rows.map((row) => ({
            id: uuid(),
            name: String(row['Nama'] || row['name'] || ''),
            gradeLevel: Number(row['Tingkat'] || row['gradeLevel'] || 0),
            section: String(row['Bagian'] || row['section'] || ''),
        })).filter((v) => v.name && v.gradeLevel);
        if (values.length === 0) {
            res.status(400).json({ error: 'Tidak ada data valid ditemukan' });
            return;
        }
        await db.insert(classes).values(values);
        res.json({ imported: values.length });
    }
    catch (err) {
        res.status(500).json({ error: 'Gagal import kelas' });
    }
});
router.post('/rooms', async (req, res) => {
    try {
        const chunks = [];
        for await (const chunk of req)
            chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        const rows = parseExcel(buffer);
        const values = rows.map((row) => ({
            id: uuid(),
            name: String(row['Nama'] || row['name'] || ''),
            code: String(row['Kode'] || row['code'] || ''),
            capacity: Number(row['Kapasitas'] || row['capacity'] || 30),
        })).filter((v) => v.name && v.code);
        if (values.length === 0) {
            res.status(400).json({ error: 'Tidak ada data valid ditemukan' });
            return;
        }
        await db.insert(rooms).values(values);
        res.json({ imported: values.length });
    }
    catch (err) {
        res.status(500).json({ error: 'Gagal import ruangan' });
    }
});
export default router;
//# sourceMappingURL=import.js.map