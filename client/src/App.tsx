import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Classes from './pages/Classes';
import Rooms from './pages/Rooms';
import TimeSlots from './pages/TimeSlots';
import Availabilities from './pages/Availabilities';
import Assignments from './pages/Assignments';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import AcademicYears from './pages/AcademicYears';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/time-slots" element={<TimeSlots />} />
          <Route path="/availabilities" element={<Availabilities />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/academic-years" element={<AcademicYears />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
