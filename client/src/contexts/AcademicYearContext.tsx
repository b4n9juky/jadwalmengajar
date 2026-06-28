import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAcademicYears } from '../hooks/useQueries';
import type { AcademicYear } from '../types';

interface AcademicYearContextType {
  academicYears: AcademicYear[];
  currentYear: AcademicYear | null;
  setCurrentYear: (ay: AcademicYear) => void;
  loading: boolean;
}

const AcademicYearContext = createContext<AcademicYearContextType>({
  academicYears: [],
  currentYear: null,
  setCurrentYear: () => {},
  loading: true,
});

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  const { data: academicYears, isLoading } = useAcademicYears();
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);

  useEffect(() => {
    if (isLoading || academicYears.length === 0) return;
    const saved = localStorage.getItem('academicYearId');
    const found = academicYears.find((y) => y.id === saved);
    if (found) {
      setCurrentYear(found);
    } else {
      setCurrentYear(academicYears[0]);
    }
  }, [academicYears, isLoading]);

  const handleSetCurrentYear = useCallback((ay: AcademicYear) => {
    setCurrentYear(ay);
    localStorage.setItem('academicYearId', ay.id);
  }, []);

  return (
    <AcademicYearContext.Provider value={{ academicYears, currentYear, setCurrentYear: handleSetCurrentYear, loading: isLoading }}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  return useContext(AcademicYearContext);
}
