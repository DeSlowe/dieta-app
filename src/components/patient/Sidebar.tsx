import { User, Salad, ArrowLeft, FileDown } from "lucide-react";

type Tab = "anagrafica" | "dieta";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onBack: () => void;
  onExport: () => void;
  patientName: string;
};

export default function Sidebar({ activeTab, onTabChange, onBack, onExport, patientName }: Props) {
  return (
    <div className="w-56 bg-white border-r min-h-screen p-4 flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Elenco pazienti
      </button>

      <div className="font-semibold mb-4 truncate">{patientName}</div>

      <nav className="flex flex-col gap-1 mb-6">
        <button
          onClick={() => onTabChange("anagrafica")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
            activeTab === "anagrafica" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-slate-50"
          }`}
        >
          <User className="w-4 h-4" /> Anagrafica
        </button>
        <button
          onClick={() => onTabChange("dieta")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
            activeTab === "dieta" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-slate-50"
          }`}
        >
          <Salad className="w-4 h-4" /> Dieta
        </button>
      </nav>

      <button
        onClick={onExport}
        className="mt-auto flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
      >
        <FileDown className="w-4 h-4" /> Esporta Excel
      </button>
    </div>
  );
}
