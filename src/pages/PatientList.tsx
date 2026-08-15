import { ArrowLeft, UserPlus, ChevronRight } from "lucide-react";
import { usePatients } from "../context/PatientContext";

type Props = {
  onSelect: (patientId: string) => void;
  onNew: () => void;
  onHome: () => void;
};

export default function PatientList({ onSelect, onNew, onHome }: Props) {
  const { patients } = usePatients();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onHome}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Torna alla home
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Elenco Pazienti</h1>
          <button
            onClick={onNew}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Nuovo Paziente
          </button>
        </div>

        <div className="bg-white rounded-xl shadow divide-y">
          {patients.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              Nessun paziente presente
            </div>
          )}

          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full flex justify-between items-center p-4 hover:bg-slate-50 text-left"
            >
              <div>
                <div className="font-medium">
                  {p.nome} {p.cognome}
                </div>
                <div className="text-sm text-slate-500">
                  {p.eta} anni · {p.peso} kg · {p.altezza} cm
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
