import { useState } from "react";
import { usePatients } from "../context/PatientContext";
import { useFolder } from "../context/FolderContext";
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
  const { folderHandle } = useFolder();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const patient = getPatient(patientId);

  if (!patient) return null;

  const handleExport = async () => {
    const result = await exportPatientToExcel(patient, folderHandle);
    setExportMsg(
      result.savedTo === "folder"
        ? `Salvato in cartella: ${result.fileName}`
        : `Scaricato: ${result.fileName}`
    );
    setTimeout(() => setExportMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeTab={tab}
        onTabChange={setTab}
        onBack={onBack}
        onExport={handleExport}
        patientName={`${patient.nome} ${patient.cognome}`}
      />

      <div className="flex-1 p-6 relative">
        {exportMsg && (
          <div className="absolute top-4 right-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow">
            {exportMsg}
          </div>
        )}
        {tab === "anagrafica" && <AnagraficaTab patient={patient} />}
        {tab === "dieta" && <DietaTab patient={patient} />}
      </div>
    </div>
  );
}
