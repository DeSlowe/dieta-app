import { useState } from "react";
import { usePatients } from "../../context/PatientContext";
import { Patient, DietTargets } from "../../models/Patient";

type Props = {
  patient: Patient;
};

export default function AnagraficaTab({ patient }: Props) {
  const { updatePatient } = usePatients();
  const [form, setForm] = useState({
    nome: patient.nome,
    cognome: patient.cognome,
    eta: patient.eta,
    peso: patient.peso,
    altezza: patient.altezza,
    targets: patient.targets,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updatePatient(patient.id, (p) => ({ ...p, ...form }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Anagrafica</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Dati paziente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Cognome</label>
            <input
              type="text"
              value={form.cognome}
              onChange={(e) => setForm({ ...form, cognome: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Età</label>
            <input
              type="number"
              value={form.eta}
              onChange={(e) => setForm({ ...form, eta: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Peso (kg)</label>
            <input
              type="number"
              value={form.peso}
              onChange={(e) => setForm({ ...form, peso: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Altezza (cm)</label>
            <input
              type="number"
              value={form.altezza}
              onChange={(e) => setForm({ ...form, altezza: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Target dieta giornalieri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {(Object.keys(form.targets) as (keyof DietTargets)[]).map((key) => (
            <div key={key}>
              <label className="block text-sm mb-1 capitalize">{key}</label>
              <input
                type="number"
                value={form.targets[key]}
                onChange={(e) =>
                  setForm({ ...form, targets: { ...form.targets, [key]: Number(e.target.value) } })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {saved ? "Salvato ✓" : "Salva modifiche"}
        </button>
      </div>
    </div>
  );
}
