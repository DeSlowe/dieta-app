import { User, Salad, ArrowLeft, FileDown, FolderOpen, FolderCheck } from "lucide-react";
import { useFolder } from "../../context/FolderContext";

type Tab = "anagrafica" | "dieta";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onBack: () => void;
  onExport: () => void;
  patientName: string;
};

export default function Sidebar({ activeTab, onTabChange, onBack, onExport, patientName }: Props) {
  const { folderName, supported, pickFolder } = useFolder();

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

      <div className="mt-auto space-y-2">
        {supported && (
          <button
            onClick={pickFolder}
            title={folderName ?? undefined}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50"
          >
            {folderName ? (
              <>
                <FolderCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span className="truncate">{folderName}</span>
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 shrink-0" />
                <span>Scegli cartella</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <FileDown className="w-4 h-4" /> Esporta Excel
        </button>
      </div>
    </div>
  );
}
