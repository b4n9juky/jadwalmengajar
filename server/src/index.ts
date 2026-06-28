import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import teachersRouter from './routes/teachers';
import subjectsRouter from './routes/subjects';
import classesRouter from './routes/classes';
import roomsRouter from './routes/rooms';
import timeSlotsRouter from './routes/timeSlots';
import availabilitiesRouter from './routes/availabilities';
import assignmentsRouter from './routes/assignments';
import schedulesRouter from './routes/schedules';
import settingsRouter from './routes/settings';
import academicYearsRouter from './routes/academicYears';
import importRouter from './routes/import';
import templatesRouter from './routes/templates';
import { generateSchedule } from './services/scheduler';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/teachers', teachersRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/time-slots', timeSlotsRouter);
app.use('/api/availabilities', availabilitiesRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/academic-years', academicYearsRouter);
app.use('/api/import', importRouter);
app.use('/api/templates', templatesRouter);

app.post('/api/schedules/generate', async (_req, res) => {
  try {
    const result = await generateSchedule();
    res.json(result);
  } catch (err) {
    console.error('Generate failed:', err);
    res.status(500).json({ error: 'Gagal membuat jadwal' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✨ JadwalAuto API running on http://localhost:${PORT}`);
});
