import { useState } from "react";
import { usePatients } from "../context/PatientContext";
import Sidebar from "../components/patient/Sidebar";
import AnagraficaTab from "../components/patient/AnagraficaTab";
import DietaTab from "../components/patient/DietaTab";
import { exportPatientToExcel } from "../utils/exportExcel";

type Tab = "anagrafica" | "dieta";

type Props = {
  patientId: string;
  initialTab?: Tab;
  onBack: () => void;
};

export default function PatientWorkspace({ patientId, initialTab = "dieta", onBack }: Props) {
  const { getPatient } = usePatients();
  const [tab, setTab] = useState<Tab>(initialTab);
  const patient = getPatient(patientId);

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeTab={tab}
        onTabChange={setTab}
        onBack={onBack}
        onExport={() => exportPatientToExcel(patient)}
        patientName={`${patient.nome} ${patient.cognome}`}
      />

      <div className="flex-1 p-6">
        {tab === "anagrafica" && <AnagraficaTab patient={patient} />}
        {tab === "dieta" && <DietaTab patient={patient} />}
      </div>
    </div>
  );
}
