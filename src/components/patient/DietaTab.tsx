import { useEffect, useRef, useState } from "react";
import { Plus, X, Upload } from "lucide-react";
import { usePatientDiet } from "../../hooks/usePatientDiet";
import { Patient } from "../../models/Patient";
import { MEAL_LABELS, MealType } from "../../models/Food";
import { computeTotals } from "../../utils/dietCalc";
import { parseDietExcel, ImportError } from "../../utils/importExcel";
import MealSection from "../diet/MealSection";
import SummaryPanel from "../diet/SummaryPanel";

type Props = {
  patient: Patient;
};

export default function DietaTab({ patient }: Props) {
  const { days, addDay, removeDay, addFood, removeItem, updateQuantity, importDays, hasAnyFood } =
    usePatientDiet(patient.id);
  const [activeDayId, setActiveDayId] = useState<string | null>(days[0]?.id ?? null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (days.length === 0) {
      addDay();
      return;
    }
    if (!activeDayId || !days.find((d) => d.id === activeDayId)) {
      setActiveDayId(days[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permette di riselezionare lo stesso file in futuro
    if (!file) return;

    try {
      const parsedDays = await parseDietExcel(file);

      if (hasAnyFood) {
        const confirmed = window.confirm(
          `Il paziente ha già una dieta compilata. Importando "${file.name}" tutti i giorni attuali verranno sostituiti. Continuare?`
        );
        if (!confirmed) return;
      }

      importDays(parsedDays);
      setActiveDayId(parsedDays[0]?.id ?? null);
    } catch (err) {
      setImportError(err instanceof ImportError ? err.message : "Errore durante la lettura del file.");
    }
  };

  const activeDay = days.find((d) => d.id === activeDayId);
  const mealOrder: MealType[] = ["colazione", "spuntino1", "pranzo", "spuntino2", "cena"];

  if (!activeDay) return null;

  const dayTotals = computeTotals(Object.values(activeDay.meals).flat());

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {days.map((day) => (
            <div
              key={day.id}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer ${
                day.id === activeDayId ? "bg-blue-600 text-white" : "bg-white border hover:bg-slate-50"
              }`}
            >
              <span onClick={() => setActiveDayId(day.id)}>{day.label}</span>
              {days.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDay(day.id);
                  }}
                  className={day.id === activeDayId ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-red-600"}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addDay}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed text-slate-500 hover:text-blue-600 hover:border-blue-600"
          >
            <Plus className="w-4 h-4" /> Aggiungi giorno
          </button>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border text-slate-600 hover:bg-slate-50 text-sm"
          >
            <Upload className="w-4 h-4" /> Importa Dieta
          </button>
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {importError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {mealOrder.map((meal) => (
            <MealSection
              key={meal}
              title={MEAL_LABELS[meal]}
              items={activeDay.meals[meal]}
              onQuantityChange={(id, qty) => updateQuantity(activeDay.id, meal, id, qty)}
              onRemove={(id) => removeItem(activeDay.id, meal, id)}
              onAddFood={(food) => addFood(activeDay.id, meal, food)}
            />
          ))}
        </div>

        <div>
          <SummaryPanel totals={dayTotals} targets={patient.targets} />
        </div>
      </div>
    </div>
  );
}
