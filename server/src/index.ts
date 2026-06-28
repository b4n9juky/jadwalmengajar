import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requireAuth } from './middleware/auth';
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
import authRouter from './routes/auth';
import { generateSchedule } from './services/scheduler';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/teachers', requireAuth, teachersRouter);
app.use('/api/subjects', requireAuth, subjectsRouter);
app.use('/api/classes', requireAuth, classesRouter);
app.use('/api/rooms', requireAuth, roomsRouter);
app.use('/api/time-slots', requireAuth, timeSlotsRouter);
app.use('/api/availabilities', requireAuth, availabilitiesRouter);
app.use('/api/assignments', requireAuth, assignmentsRouter);
app.use('/api/schedules', requireAuth, schedulesRouter);
app.use('/api/settings', requireAuth, settingsRouter);
app.use('/api/academic-years', requireAuth, academicYearsRouter);
app.use('/api/import', requireAuth, importRouter);
app.use('/api/templates', requireAuth, templatesRouter);

app.post('/api/schedules/generate', requireAuth, async (req, res) => {
  const { academicYearId } = req.body;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  try {
    const result = await generateSchedule(academicYearId);
    res.json(result);
  } catch (err) {
    console.error('Generate failed:', err);
    res.status(500).json({ error: 'Gagal membuat jadwal' });
  }
});

app.listen(PORT, () => {
  console.log(`✨ JadwalAuto API running on http://localhost:${PORT}`);
});
