import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { usePatients } from "../context/PatientContext";
import { DietTargets } from "../models/Patient";
import { emptyMeals } from "../models/Food";

type Props = {
  onCreated: (patientId: string) => void;
  onCancel: () => void;
};

const defaultTargets: DietTargets = {
  kcal: 2000,
  proteins: 120,
  carbs: 220,
  fats: 65,
  fiber: 30,
};

const TARGET_LABELS: Record<keyof DietTargets, string> = {
  kcal: "Kcal",
  proteins: "Proteine (g)",
  carbs: "Carboidrati (g)",
  fats: "Grassi (g)",
  fiber: "Fibre (g)",
};

export default function NewPatientForm({ onCreated, onCancel }: Props) {
  const { addPatient } = usePatients();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [eta, setEta] = useState<number>(30);
  const [peso, setPeso] = useState<number>(70);
  const [altezza, setAltezza] = useState<number>(170);
  const [targets, setTargets] = useState<DietTargets>(defaultTargets);

  // Kcal ricalcolate in tempo reale: proteine 4 kcal/g, carboidrati 4 kcal/g, grassi 9 kcal/g
  useEffect(() => {
    const kcal = targets.proteins * 4 + targets.carbs * 4 + targets.fats * 9;
    if (kcal !== targets.kcal) {
      setTargets((t) => ({ ...t, kcal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.proteins, targets.carbs, targets.fats]);

  const isValid = nome.trim() !== "" && cognome.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    const now = new Date().toISOString();
    const patient = addPatient({
      nome,
      cognome,
      eta,
      peso,
      altezza,
      targets,
      dietCreatedAt: now,
      days: [{ id: crypto.randomUUID(), label: "Giorno 1", meals: emptyMeals() }],
    });
    onCreated(patient.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Torna alla home
        </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Nuovo Paziente</h1>

          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Anagrafica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cognome</label>
              <input
                type="text"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Età</label>
              <input
                type="number"
                min={0}
                value={eta}
                onChange={(e) => setEta(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Peso (kg)</label>
              <input
                type="number"
                min={0}
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Altezza (cm)</label>
              <input
                type="number"
                min={0}
                value={altezza}
                onChange={(e) => setAltezza(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-1">
            Target dieta giornalieri
          </h2>
          <p className="text-xs text-slate-400 mb-3">
            Le Kcal si calcolano automaticamente (proteine e carboidrati 4 kcal/g, grassi 9 kcal/g)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {(Object.keys(targets) as (keyof DietTargets)[]).map((key) => (
              <div key={key}>
                <label className="block text-sm mb-1">{TARGET_LABELS[key]}</label>
                <input
                  type="number"
                  min={0}
                  value={key === "kcal" ? Math.round(targets.kcal) : targets[key]}
                  readOnly={key === "kcal"}
                  disabled={key === "kcal"}
                  onChange={(e) =>
                    setTargets({ ...targets, [key]: Number(e.target.value) })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    key === "kcal" ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Crea paziente e apri dieta
          </button>
        </div>
      </div>
    </div>
  );
}
