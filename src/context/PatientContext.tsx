import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Patient } from "../models/Patient";

const STORAGE_KEY = "dieta-app:patients";

function loadPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

type PatientContextValue = {
  patients: Patient[];
  addPatient: (data: Omit<Patient, "id" | "createdAt">) => Patient;
  getPatient: (id: string) => Patient | undefined;
  updatePatient: (id: string, updater: (p: Patient) => Patient) => void;
};

const PatientContext = createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(loadPatients);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = (data: Omit<Patient, "id" | "createdAt">) => {
    const patient: Patient = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [...prev, patient]);
    return patient;
  };

  const getPatient = (id: string) => patients.find((p) => p.id === id);

  const updatePatient = (id: string, updater: (p: Patient) => Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  };

  return (
    <PatientContext.Provider value={{ patients, addPatient, getPatient, updatePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error("usePatients must be used within PatientProvider");
  return ctx;
}
