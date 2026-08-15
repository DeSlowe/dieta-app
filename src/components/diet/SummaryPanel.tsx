import { Totals } from "../../utils/dietCalc";
import { DietTargets } from "../../models/Patient";

function Bar({ label, value, target, unit }: { label: string; value: number; target: number; unit: string }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const over = value > target;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className={over ? "text-red-600" : "text-slate-500"}>
          {value.toFixed(0)} / {target} {unit}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${over ? "bg-red-500" : "bg-blue-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type Props = {
  totals: Totals;
  targets: DietTargets;
};

export default function SummaryPanel({ totals, targets }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Riepilogo giorno</h2>

      <Bar label="Calorie" value={totals.kcal} target={targets.kcal} unit="kcal" />
      <Bar label="Proteine" value={totals.proteins} target={targets.proteins} unit="g" />
      <Bar label="Carboidrati" value={totals.carbs} target={targets.carbs} unit="g" />
      <Bar label="Grassi" value={totals.fats} target={targets.fats} unit="g" />
      <Bar label="Fibre" value={totals.fiber} target={targets.fiber} unit="g" />

      <p className="text-xs text-slate-400 mt-4">
        I target si modificano dalla sezione Anagrafica.
      </p>
    </div>
  );
}
